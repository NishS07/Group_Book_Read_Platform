//this file ensures that the AdminGroupPage component renders correctly with key elements
import {render, screen} from "@testing-library/react";
import { BrowserRouter } from "react-router";
import AdminGroupPage from "../Components/AdminGroupPage";

describe("AdminGroupPage Component", () => {
    //test to check rendering some key elements
    test("renders the AdminGroupPage without crashing", () => {
        render(
            //render component inside BrowserRouter for navigation support
            <BrowserRouter>
                <AdminGroupPage />
            </BrowserRouter>
        );
        //verify presense of main heading
        expect(screen.getByRole("heading", {name: /Group Book Reading Club/i})).toBeInTheDocument();
        expect(screen.getByText(/Group Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Add\/Edit Group Data/i)).toBeInTheDocument();
        //check if input fields present
        expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Reading Goals/i)).toBeInTheDocument();
        //check create group button presence
        expect(screen.getByRole("button", {name: /Create Group/i})).toBeInTheDocument();

        //verify some table columns
        expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Reading Goals/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();

    });
})