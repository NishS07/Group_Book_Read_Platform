//this file ensures that the AdminChapterPage component renders correctly with some key elements
import { render, screen } from "@testing-library/react";
import AdminChapterPage from "../Components/AdminChapterPage";
import { BrowserRouter } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


describe("AdminChapterPage Component", () => {
    //test to check rendering some elements
    test("renders the component with heading", async () => {
    render(
        //render the component inside BrowserRouter and LocalizationProvider for navigation and date handling
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AdminChapterPage />
            </LocalizationProvider>
        </BrowserRouter>
    );

    //verify presense of section headings
    expect(await screen.findByText(/Chapter Management/i)).toBeInTheDocument();
    expect(await screen.findByText(/Add\/Edit Chapter Data/i)).toBeInTheDocument();
    //check is any input field renderd
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    //ensure add chapter button is present
    expect(screen.getByRole("button", { name: /Add Chapter/i })).toBeInTheDocument();
  });
});