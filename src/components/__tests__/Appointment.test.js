/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { render } from "@testing-library/react";

/*
  We import the component that we are testing
*/
import Appointment from "components/Appointment";
import Form from "components/Appointment/Form";

describe("Appointment", () => {
  it("renders without crashing", () => {
    render(<Appointment />);
  });

  // 'xit' and 'test.skip' to skip tests.
  it("does something it is supposed to do", () => {
    // ...
  });

  // 'it' and 'test' are interchangeable.
  it("does something else it is supposed to do", () => {
    // ...
  });
});