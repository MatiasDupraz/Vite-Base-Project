import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null),
    [cartProducts, setCartProducts] = useState(null),
    [cartTotal, setCartTotal] = useState(null),
    [cartWeight, setCartWeight] = useState(null);

  //Create a limit time for the session triggered by inactivity
  const SESSION_TIMEOUT = 30 * 60 * 1000; // Defined in miliseconds

  // Timer variable to track session timeout
  let sessionTimer;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      const validateSession = async () => {
        try {
          await axios.get(
            `http://localhost:5000/sessionValidator?e=${encodeURIComponent(
              parsedUser.usuario_correo
            )}`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser.accessToken}`,
              },
            }
          );

          setUser(parsedUser);
        } catch (err) {
          setUser(null);
          if (err.response && err.response.status === 401) {
            console.log("Error de autenticación");
          } else {
            console.error("Error during request:", err);
          }
        }
      };

      validateSession();

      const handleUserActivity = () => {
        clearTimeout(sessionTimer);

        sessionTimer = setTimeout(() => {
          setUser(null);
          localStorage.removeItem("user");
        }, SESSION_TIMEOUT);
      };

      window.addEventListener("mousemove", handleUserActivity);
      window.addEventListener("keydown", handleUserActivity);

      return () => {
        clearTimeout(sessionTimer);
        window.removeEventListener("mousemove", handleUserActivity);
        window.removeEventListener("keydown", handleUserActivity);
      };
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      const storedProducts = localStorage.getItem("cartProducts");
      const total = localStorage.getItem("cartTotal");
      if (storedProducts) {
        setCartProducts(JSON.parse(storedProducts));
      }
      if (total) {
        setCartTotal(JSON.parse(total));
      }
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        cartProducts,
        setCartProducts,
        cartTotal,
        setCartTotal,
        cartWeight,
        setCartWeight,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
