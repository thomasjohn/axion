import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import App from "./App";

test("renders title", () => {
  render(<App />);
  const linkElement = screen.getByText(/github repos/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders no data", () => {
  render(<App />);
  const table = screen.getByTestId("id-result-no-data");
  expect(table).toBeInTheDocument();
});

test("waiting for data", async () => {
  render(<App />);
  const accountNameInput = screen.getByTestId("id-account-name");
  const getDataButton = screen.getByTestId("id-get-data");
  fireEvent.change(accountNameInput, { target: { value: "thomasjohn" } });
  fireEvent.click(getDataButton);
  await waitFor(
    () => {
      const table3 = screen.getByTestId("id-result-has-data");
      expect(table3).toBeInTheDocument();
    },
    { timeout: 2000 }
  );
});
