import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import googleIcon from "./../assets/icons/google.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/sessionContext";
import Notification from "../components/Notification";
export const GoogleLogin = () => {
  const [gUser, setGuser] = useState([]);
  const { setUser } = useUser();
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGuser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (gUser) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${gUser.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${gUser.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [gUser]);

  const fetchUser = async () => {
    if (profile) {
      try {
        const response = await axios.get(
          `http://localhost:5000/googleLogin?e=${encodeURIComponent(
            profile.email
          )}&aid=${encodeURIComponent(profile.id)}&n=${profile.given_name}`
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        navigate("/");
        Notification({
          text: "Inicio de sesión correcto",
          success: true,
        });
      } catch (err) {
        console.error(`Error fetching user from database: ${err}`);
        Notification({
          text: "Error de conexión, intente nuevamente",
          error: true,
        });
        if (err.response) {
          console.log(err.response);
        }
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const finalResponse = await fetchUser(); // Wait for fetchUser to complete

        setGuser(finalResponse.data); // Set the user state with the data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Call the fetchUserData function
  }, [profile]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <React.Fragment>
      {profile ? (
        <button
          className="bg-white active:bg-blueGray-50 text-blueGray-700  px-10 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
          type="button"
          onClick={() => logOut()}
        >
          {profile.email}
        </button>
      ) : (
        <button
          className="bg-white active:bg-blueGray-50 text-blueGray-700  px-10 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
          type="button"
          onClick={() => login()}
        >
          <img alt="..." className="w-5 mr-1" src={googleIcon} />
          Google{" "}
        </button>
      )}
    </React.Fragment>
  );
};

export default GoogleLogin;
