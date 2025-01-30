//this file verifies that the AdminBookPage component renders correctly with key elements
import {render, screen} from "@testing-library/react";
import { BrowserRouter } from "react-router"; 
import AdminBookPage from "../Components/AdminBookPage";

describe("AdminBookPage Component", () => {
    //to check AdminBookPage renders key elements
    test("renders the AdminBookPage with key elements", () => {
        //render component inside Browser router for navigation support
        render(
            <BrowserRouter>
                <AdminBookPage />
            </BrowserRouter>
        );
        //verify heading
        expect(screen.getByRole("heading", {name: /Group Book Reading Club/i})).toBeInTheDocument();
        //verify subheadings
        expect(screen.getByText(/Book Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Add\/Edit Books Data/i)).toBeInTheDocument();
        //verify form fields
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Genre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();

        //add book button
        expect(screen.getByRole("button", {name: /Add Book/i})).toBeInTheDocument();

        //table headers
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Genre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    });
})