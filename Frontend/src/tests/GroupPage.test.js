//this test file ensures that the GroupPage component renders correctly
//displays group details, members, chapter information and manages button interactions for unread chapters

import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import GroupPage from "../Components/GroupPage";
import { useParams } from "react-router";
import axios from "axios";

//mocking react-router
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

//mocking axios
jest.mock("axios");

describe("GroupPage Component", () => {
    beforeEach(() => {
        //mocking url parameter for group
        useParams.mockReturnValue({ groupId: "1" });
        //mock API responses
        axios.get.mockImplementation((url) => {
            if (url.includes("/api/groups/1/")) {
                return Promise.resolve({
                    data: {
                        id: 1,
                        name: "Test Group",
                        book: { title: "Test Book", author: "John Doe" },
                        reading_goals: "Read one chapter per week",
                        members: [{ id: 1, username: "Alice" }, { id: 2, username: "Bob" }],
                    },
                });
            } else if (url.includes("/api/progress/")) {
                return Promise.resolve({
                    data: [
                        {
                            group_id: 1,
                            chapters: [
                                {
                                    chapter_id: 101,
                                    title: "Chapter 1",
                                    deadline: "2025-02-01",
                                    read_users: [{ id: 1 }], 
                                    read_percentage: 50,
                                },
                            ],
                        },
                    ],
                });
            } 
            else if (url.includes("/api/user-id/")) {
                return Promise.resolve({ data: { userId: 1 } });
            }
            return Promise.reject(new Error("Not found"));
        });
    });

    //test to check if loading message is displayed initially
    test("renders loading message initially", () => {
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );
        expect(screen.getByText(/loading group details/i)).toBeInTheDocument();
    });

    //test to check if group name and book details are rendered correctly
    test("renders group name and book details", async () => {
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Group")).toBeInTheDocument();
            expect(screen.getByText(/Book: Test Book by John Doe/i)).toBeInTheDocument();
        });
    });

    //test to check if group members are displayed correctly
    test("displays members in the group", async () => {
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Alice")).toBeInTheDocument();
            expect(screen.getByText("Bob")).toBeInTheDocument();
        });
    });

    //test to check if chapter information is displayed correctly
    test("displays chapter information correctly", async () => {
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText("Chapter 1")).toBeInTheDocument();
            expect(screen.getByText("2025-02-01")).toBeInTheDocument();
            expect(screen.getByText("50%")).toBeInTheDocument();
        });
    });

    //test to check if "Mark as Read" button is displayed for unread chapters
    test("shows 'Mark as Read' button for unread chapters", async () => {
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /mark as unread/i })).toBeInTheDocument();
        });
    });

    //test to check if "Go to Discussion" button in rendered
    test("renders 'Go to Discussion' button", async () => {
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /go to discussion/i })).toBeInTheDocument();
        });
    });
    
    //test to check if the "Group not found" message  is displayed when group data is null
    test("displays 'Group not found' message when group data is null", async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: null }));
        render(
            <BrowserRouter>
                <GroupPage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText(/group not found/i)).toBeInTheDocument();
        });
    });
});