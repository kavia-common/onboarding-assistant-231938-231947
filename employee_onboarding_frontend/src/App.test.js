import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard shell", () => {
  render(<App />);
  // Top bar title includes the current view name
  expect(screen.getByText(/Chat Assistant/i)).toBeInTheDocument();
});
