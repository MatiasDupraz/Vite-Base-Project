import { useState } from "react";
import Button from "./components/Button";

function App() {
  const [button, setButton] = useState({ success: true });
  const toggleSuccess = () => {
    setButton({ ...button, success: !button.success });
    console.log(button);
  };
  return (
    <>
      <h1>Hi</h1>
      <h2>The project is working</h2>
      <Button toggleSuccess={toggleSuccess} button={button} />
      <Button />
    </>
  );
}

export default App;
