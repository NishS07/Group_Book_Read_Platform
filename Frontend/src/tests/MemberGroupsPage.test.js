//this test file ensures that the YourGroupPage component is rendered correctly
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";
import YourGroupsPage from "../Components/MemberGroupsPage";

//mocking axios to simulate the API response with an array for the groups data
jest.mock("axios", () => ({
    get: jest.fn(() => Promise.resolve({data: []})), //simulate empty data for groups
}));

describe("Members Group Page Component", () => {
    //ensure heading "Your Groups" is rendered correctly on the page
    test("renders the heading", () => {
        render(
            <Router>
                <YourGroupsPage />
            </Router>
        );
        expect(screen.getByText("Your Groups")).toBeInTheDocument();
    });

    //test 'Back to Home' button is rendered and present on the page
    test("renders the 'Back to Home' button", () => {
        render(
            <Router>
                <YourGroupsPage />
            </Router>
        );
        expect(screen.getByRole("button", {name: /back to home/i})).toBeInTheDocument();
    });

    //check loading text is displayed initially when the component is waiting for data
    test("displays the loading text initially", () => {
        render(
            <Router>
                <YourGroupsPage />
            </Router>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});