//this test file ensures that the BookSelectionPage Component renders correctly, displays the expected elements
//correctly fetches and displays book data
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";
import BookSelectionPage from "../Components/BookSelectionPage";
import axios from "axios";

//mock axios to simulate API calls
jest.mock("axios");

describe("BookSelectionPage", () => {
    beforeEach(() => {
        //clear mocks before each test to avoid interference
        jest.clearAllMocks();
    });

    //test to check if the page renders correctly with title and table structure
    test("renders the page with correct title and table structure", async () => {
        render(
            <Router>
                <BookSelectionPage />
            </Router>
        );
        //verify presence of main heading
        expect(screen.getByText("Select a Book to Join or Create a Group")).toBeInTheDocument();
        //verify back button
        expect(screen.getByRole("button", { name: /back to home/i })).toBeInTheDocument();
        //verify table column headers
        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("Author")).toBeInTheDocument();
        expect(screen.getByText("Genre")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
    });
    
    //test to check if the book data fetched from the API is displayed correctly in the table
    test("renders the book table with data fetched from API", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    title: "Book Title 1",
                    author: "Author 1",
                    genre: "Genre 1",
                    description: "Description 1",
                },
                {
                    id: 2,
                    title: "Book Title 2",
                    author: "Author 2",
                    genre: "Genre 2",
                    description: "Description 2",
                },
            ],
        });
        render(
            <Router>
                <BookSelectionPage />
            </Router>
        );
        //ensure book data appears in the document after being fetched
        const bookTitle1 = await screen.findByText("Book Title 1");
        const bookTitle2 = await screen.findByText("Book Title 2");
        expect(bookTitle1).toBeInTheDocument();
        expect(bookTitle2).toBeInTheDocument();
        expect(screen.getByText("Author 1")).toBeInTheDocument();
        expect(screen.getByText("Genre 1")).toBeInTheDocument();
        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Author 2")).toBeInTheDocument();
        expect(screen.getByText("Genre 2")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();
    });

});

