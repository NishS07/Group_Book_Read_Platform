//this test file ensures that the AdminHomePage component renders correctly, displays 
//appropriate elements and handles navigation and logout functionality as expected
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import AdminHomePage from "../Components/AdminHomePage";
import { useNavigate } from "react-router";

//mock useNavigate from react-router to track navigation calls
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));


describe("AdminHomePage Component", () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        //mock username for authentication
        localStorage.setItem("username", "AdminUser");
    });

    afterEach(() => {
        //clear localstorage after each test
        localStorage.clear();
        //reset all mock functions
        jest.clearAllMocks();
    });
    
    //test to check if AdminHomePage renders correctly with key elements
    test("renders without crashing and displays username", async () => {
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        //verify presence of main ui elements
        expect(screen.getByText("Group Book Reading Club")).toBeInTheDocument();
        expect(screen.getByText("Admin Home Page")).toBeInTheDocument();
        expect(screen.getByText("Welcome, AdminUser")).toBeInTheDocument();
        expect(screen.getByText("What would you like to manage today?")).toBeInTheDocument();
        //ensure management options are available
        expect(screen.getByText("Manage Books")).toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.getByText("Manage Chapters")).toBeInTheDocument();
    });
    
    //test to check if avatar correctly displays 
    test("displays avatar with first letter of username", () => {
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        expect(screen.getByText("A")).toBeInTheDocument(); //"A" from "AdminUser"
    });
    
    //test navigation to books management page
    test("navigates to books page when 'Manage Books' is clicked", () => {
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText("Manage Books"));
        expect(mockNavigate).toHaveBeenCalledWith("/admin/books");
    });
    
    //test navigation to groups management page
    test("navigates to groups page when 'Manage Groups' is clicked", () => {
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText("Manage Groups"));
        expect(mockNavigate).toHaveBeenCalledWith("/admin/groups");
    });
    
    //test navigation to chapter management page
    test("navigates to chapters page when 'Manage Chapters' is clicked", () => {
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText("Manage Chapters"));
        expect(mockNavigate).toHaveBeenCalledWith("/admin/chapters");
    });
    
    //test logout functionality and navigation to the login page
    test("logs out and navigates to login page when logout button is clicked", () => {
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByTitle("Logout"));
        //ensure user authentication data is cleared
        expect(localStorage.getItem("accessToken")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
        expect(localStorage.getItem("username")).toBeNull();
        //redirection to login page
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    //test redirection to login page when username is missing
    test("redirects to login page if username is missing", async () => {
        localStorage.removeItem("username");//simulate missing username
        render(
            <BrowserRouter>
                <AdminHomePage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/"); //expect redirection to login
        });
    });
});