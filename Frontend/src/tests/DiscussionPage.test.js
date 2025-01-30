//this test file ensures that the DiscussionPageComponent renders correctly, displays discussion threads
//allows users to post and reply, handles cases with no discussions
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import DiscussionPage from "../Components/DiscussionPage";
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

describe("DiscussionPage Component", () => {
    beforeEach(() => {
        //mocking URL parameters for group and chapter
        useParams.mockReturnValue({ groupId: "1", chapterId: "101" });
        //mock API responses
        axios.get.mockImplementation((url) => {
            if (url.includes("/api/groupchapter/1/chapter/101/")) {
                return Promise.resolve({
                    data: {
                        title: "Test Chapter",
                        deadline: "2025-02-10T00:00:00Z",
                    },
                });
            } 
            else if (url.includes("/api/groups/1/discussions_by_chapter")) {
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            user: { username: "Alice" },
                            content: "This is a test post",
                            created_at: "2025-01-20T12:00:00Z",
                            replies: [],
                        },
                    ],
                });
            }
            return Promise.reject(new Error("Not found"));
        });
        //mock API response for posting new discussions
        axios.post.mockResolvedValue({
            data: {
                id: 2,
                user: { username: "Bob" },
                content: "New post added",
                created_at: "2025-01-21T15:30:00Z",
                replies: [],
            },
        });
    });
    
    //test to check if discussion threads are rendered correctly
    test("renders discussion threads", async () => {
        render(
            <BrowserRouter>
                <DiscussionPage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText("Discussion Threads")).toBeInTheDocument();
            expect(screen.getByText("Alice")).toBeInTheDocument();
            expect(screen.getByText("This is a test post")).toBeInTheDocument();
        });
    });
    
    //test to check if a message is displayed when there are no discussions 
    test("shows 'No discussions yet' message if no posts exist", async () => {
        axios.get.mockResolvedValueOnce({ data: [] });
        render(
            <BrowserRouter>
                <DiscussionPage />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText("No discussions yet. Be the first to start a conversation!")).toBeInTheDocument();
        });
    });

    //test to check if users can add new post
    test("allows adding a new post", async () => {
        render(
            <BrowserRouter>
                <DiscussionPage />
            </BrowserRouter>
        );
        //find input field and add new discussion post
        const input = await screen.findByPlaceholderText("Write your post here...");
        fireEvent.change(input, { target: { value: "New discussion post" } });
        //ensure post button is enabled and click it
        const postButton = screen.getByRole("button", { name: /post/i });
        expect(postButton).not.toBeDisabled();
        fireEvent.click(postButton);
        //wait for new post to appear in the discussion
        await waitFor(() => {
            expect(screen.getByText("New post added")).toBeInTheDocument();
        });
    });

    //test to check if users can reply to a discussion post
    test("allows replying to a discussion post", async () => {
        render(
            <BrowserRouter>
                <DiscussionPage />
            </BrowserRouter>
        );
        //ensure discussion post is displayed
        await waitFor(() => {
            expect(screen.getByText("Alice")).toBeInTheDocument();
        });
        //find reply input and enter a reply
        const replyInput = screen.getByPlaceholderText("Write a reply...");
        fireEvent.change(replyInput, { target: { value: "This is a reply" } });
        //ensure reply button is enabled and click it
        const replyButton = screen.getByRole("button", { name: /reply/i });
        expect(replyButton).not.toBeDisabled();
        fireEvent.click(replyButton);
        //wait for the new reply to be added to the discussion
        await waitFor(() => {
            expect(screen.getByText("New post added")).toBeInTheDocument();
        });
    });
});