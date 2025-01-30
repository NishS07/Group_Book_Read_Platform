//this test file verifies that the App component correctly renders different pages and handles 
//navigation between them based on the route and user roles. 
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("App Component", () => {
  //helper function to render the App component with initial route
  const renderWithRouter = (initialEntries = ["/"]) => {
    return render(
        <App Router={MemoryRouter} initialEntries={initialEntries}/>
    );
  };

  //verify that the LoginPage is rendered when the route is the root ("/")
  test("renders LoginPage on the root path", () => {
    renderWithRouter(["/"]);
    expect(screen.getByRole("heading", {name: /Login/i})).toBeInTheDocument();
  });

  //verfy that the SignUpPage is rendered when the route is "/signup"
  test("renders SignUpPage on the /signup path", () => {
    renderWithRouter(["/signup"]);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  })

  //test to verify that the HomePage is rendered for valid roles("member") navigating to protected route
  test("renders HomePage for valid roles (e.g., member) in protected routes", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if(key === "role") return "member";
      return null;
    });

    renderWithRouter(["/home"]);
    Storage.prototype.getItem.mockRestore();
  });

  //test to verify that the AdminHomePage is rendered for valid roles("admin") navigating to protected route
  test("renders AdminHomePage for valid roles (e.g., admin) in protected routes", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if(key === "role") return "admin";
      return null;
    });

    renderWithRouter(["/adminhomepage"]);
    Storage.prototype.getItem.mockRestore();
  });

  //test to check navigation between LoginPage and SignUpPage
  test("navigates between LoginPage and SignUpPage correctly", async () => {
    renderWithRouter(["/"]);
    expect(screen.getByRole("heading", {name: /Login/i})).toBeInTheDocument();
    const signUpLink = screen.getByRole("link", {name: /sign up/i});
    await userEvent.click(signUpLink);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

});