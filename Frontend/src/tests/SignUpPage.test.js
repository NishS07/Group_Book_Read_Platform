//verifies that the SignUp page component is rendered correctly
import {render, screen} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";
import SignUpPage from "../Components/SignUpPage";

//helper function to render the component with router context for handling routing
const renderWithRouter = (ui) => {
    return render(<Router>{ui}</Router>);
};

describe("SignUpPage", () => {
    //test to check if main header is displayed
    test("renders the signup page header", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByText(/Group Book Reading Club/i)).toBeInTheDocument()
    });

    //test to check "Sign Up" header rendered
    test("renders the signup section heading", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByRole("heading", {name: /Sign Up/i})).toBeInTheDocument();
    });

    //check rendering of username input field
    test("renders the username input field", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    });

    //check rendering of email input field
    test("renders the email input field", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    });

    //check rendering of password input field
    test("renders the password input field", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    //check rendering of confirm password input field
    test("renders the confirm password input field", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    });

    //check rendering of drop down
    test("renders the role dropdown with options", async () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByText(/Select Role/i)).toBeInTheDocument();
    });

    //check rendering of sign up button
    test("renders the sign-up button", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByRole("button", {name: /Sign Up/i})).toBeInTheDocument();
    });

    //check rendering of back to login button
    test("renders the back to login button", () => {
        renderWithRouter(<SignUpPage />);
        expect(screen.getByRole("button", {name: /Back to Login/i})).toBeInTheDocument();
    });

});