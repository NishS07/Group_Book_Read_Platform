//Ensures that the LoginPage component is rendered properly
import {render, screen} from "@testing-library/react";
import LoginPage from "../Components/LoginPage";
import { BrowserRouter as Router } from "react-router";

//mocking axios for testing purpose
jest.mock("axios");

describe("LoginPage rendering", () => {
    //render component with router wrapper for handling routing
    const renderWithRouter = (ui) => {
        return render(<Router>{ui}</Router>);
    };

    //test to check page title and header rendered correctly
    test("renders the page title and header", () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByText(/Group Book Reading Club/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", {name: /Login/i})).toBeInTheDocument();
    });

    //check username input field rendered correctly
    test("renders the username input field", () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    });

    //check password input field rendered correctly
    test("renders the password input field", () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    });

    //check login button rendered correctly
    test("renders the login button", () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByRole("button", {name: /Login/i})).toBeInTheDocument();
    });

    //check signup link rendered correctly
    test("renders the sign-up link", () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
        expect(screen.getByRole("link", {name: /Sign Up/i})).toBeInTheDocument();
    });
});