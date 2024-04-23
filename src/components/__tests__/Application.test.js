import React from "react";

import {
  prettyDOM,
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getByAltText,
  getAllByTestId,
  getByPlaceholderText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

//Jest will set axios to point to our mocked axios...I think on runtime.
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText, } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));
    expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
  });

  //   Render the Application.
  // Wait until the text "Archie Cohen" is displayed.
  // Click the "Add" button on the first empty appointment.
  // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
  // Click the first interviewer in the list.
  // Click the "Save" button on that same appointment.
  // Check that the element with the text "Saving" is displayed.
  // Wait until the element with the text "Lydia Miller-Jones" is displayed.
  // Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    //add button
    fireEvent.click(getByAltText(appointment, "Add"));

    //enter student name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    //click on interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //save
    fireEvent.click(getByText(appointment, "Save"));

    //saving should show up
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //Wait for name to show up
    //Query will return null if it cant find a match
    //getBy will throw an error, if it cant find a match
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //get all the days
    const days = getAllByTestId(container, "day");

    //find the no spots remaining / Monday
    //this case query is good because we want to not throw an error if it cant find the text on the very first element (could be 2nd, 3rd, etc).
    const day = days.find(element => queryByText(element, "Monday"));

    //expect no spots remaining should show up
    expect(getByText(day, /No sPoTs remAInIng/i)).toBeInTheDocument();

    //console.log(prettyDOM(day));
    //debug();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, /Are you sure you would like to delete/i)).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, /Deleting/i)).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const newAppts = getAllByTestId(container, "day");
    const mondayAppt = newAppts.find(element => queryByText(element, "Monday"));
    expect(getByText(mondayAppt, /2 Spots Remaining/i)).toBeInTheDocument();

    // console.log(prettyDOM(firstAppt));
    // debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Edit Button
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Edit the name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Robert Shum" }
    });

    // 5. Save
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Verify success
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //Wait for name to show up
    await waitForElement(() => getByText(appointment, "Robert Shum"));

    // 7. Verify ONE spot remaining
    const newAppts = getAllByTestId(container, "day");
    const mondayAppt = newAppts.find(element => queryByText(element, "Monday"));
    expect(getByText(mondayAppt, /1 Spot Remaining/i)).toBeInTheDocument();

    // console.log(prettyDOM(appointment));
    // debug();
  });

  /* test number five */
  it("shows the save error when failing to save an appointment", async () => {

    //reject our put request from our mock, ONCE, then revert to normal.
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Edit Button
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Edit the name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Robert Shum" }
    });

    // 5. Save
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Verify saving
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Verify could not book appt.
    await waitForElement(() => getByText(appointment, "Could not book appointment."));

    //console.log(prettyDOM(appointment));
    //debug();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {

    //reject our put request from our mock, ONCE, then revert to normal.
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Delete Button
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(element => queryByText(element, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Confirm
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Verify deleting
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Verify could not delete message
    await waitForElement(() => getByText(appointment, "Could not cancel appointment."));

    //console.log(prettyDOM(appointment));
    //debug();
  });
})


