//this test files ensures HomePage component renders correctly, displays user-specifuc content and
//handles logout functionality
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";
import HomePage from "../Components/HomePage";


describe("HomePage Component", () => {
    //mocking local storage for testing purpose
    beforeEach(() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn((key) => {
                    if(key === "username") return "TestUser"; //mocking retrieval of username
                    if(key === "accessToken") return "testAccessToken"; //mocking retrieval of access token
                    return null;
                }),
                setItem: jest.fn(),
                removeItem: jest.fn(), //mocking removeItem method to track its usage during logout
            },
            writable: true,
        });
    });

    //test to check if HomePage renders correctly and displays necessary information
    test("renders HomePage and components properly", async () => {
        render(
            <Router>
                <HomePage />
            </Router>
        );
        expect(screen.getByText("Group Book Reading Club!", {exact: false})).toBeInTheDocument();
        expect(screen.getByText("Member Home Page")).toBeInTheDocument();
        //check for personalized welcome message
        expect(screen.getByText("Welcome, TestUser")).toBeInTheDocument();
        expect(screen.getByText("Available Books")).toBeInTheDocument();
        expect(screen.getByText("Available Groups")).toBeInTheDocument();
    });


    //test to ensure the logout functionality
    test("renders logout and testing its functionality", async () => {
        render(
            <Router>
                <HomePage />
            </Router>
        );
        //simulating click event on logout button
        const logoutButton = screen.getByTitle("Logout");
        fireEvent.click(logoutButton);
        //verify that the necessary localStorage items (accessToken, refreshToken, username) are removed 
        expect(window.localStorage.removeItem).toHaveBeenCalledWith("accessToken");
        expect(window.localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
        expect(window.localStorage.removeItem).toHaveBeenCalledWith("username");
    });
});