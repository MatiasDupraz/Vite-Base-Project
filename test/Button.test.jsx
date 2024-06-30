import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../src/components/Button";

// In this test example we are calling a button with and without props
// We are also calling a hook and passing down the state and the toggle function, this is because useState cannot be called directly in the tests

const ButtonWrapper = ({ initialSuccess = true }) => {
  const [button, setButton] = React.useState({ success: initialSuccess });
  const toggleSuccess = () => {
    setButton((prevButton) => ({
      ...prevButton,
      success: !prevButton.success,
    }));
  };

  return <Button toggleSuccess={toggleSuccess} button={button} />;
};

describe("<Button />", () => {
  it("should match snapshot without props", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toMatchSnapshot();
  });

  it("should match snapshot with primary prop", () => {
    render(<ButtonWrapper />);
    expect(screen.getByRole("button")).toMatchSnapshot();
  });
});
