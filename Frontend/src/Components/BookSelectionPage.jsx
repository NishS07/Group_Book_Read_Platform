//This components allow users(role members) to select a book and create a new or join existing group.

import { useState, useEffect } from "react";
import {
        Box, 
        Typography,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        Button,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        TextField,
        IconButton,
    } from "@mui/material";
import { 
        Group, 
        Visibility, 
        Close, 
        ArrowBack 
    } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router";

 
const BookSelectionPage = () => {
    //initial state
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [readingGoals, setReadingGoals] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
 
    //fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get("http://localhost:8087/api/books/", { headers });
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books: ", error);
            }
        };
        fetchBooks();
    }, []);
 
    //fetch groups for a selected book from API
    const fetchGroupsForBooks = async (bookId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8087/api/group-by-book/?book=${bookId}`, { headers });
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups: ", error);
        }
    };
 
    //create or join a group for 'request' user
    const handleCreateOrJoinGroup = async (groupName, bookId, readingGoals = "") => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${token}` };
            const data = { name: groupName, reading_goals: readingGoals };
 
            const response = await axios.post(`http://localhost:8087/api/books/${bookId}/groups/`, data, { headers });
            const { created, group } = response.data;
 
            if (created) {
                //notify user on successful group creation
                alert("Group created successfully!");
            } else {
                //notify on successful joining group
                alert("Successfully joined the group!");
            }
        } catch (error) {
            //Handle already a member case
            if (error.response && error.response.data.error) {
                alert("You are already part of the group.");
            } else {
                console.error("Error creating or joining group", error);
            }
        }
    };
 
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)",
                color: "#ffffff",
                padding: 3,
            }}
        >
            {/*Back to Home Button*/}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate("/home")}
                      sx={{
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        '&:hover': {
                          background: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    >
                      Back to Home
                    </Button>
                  </Box>
 
            {/*Page Title*/}
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
                Select a Book to Join or Create a Group
            </Typography>
 
            {/* Book Table */}
            <TableContainer component={Paper} sx={{ maxWidth: "80%", mb: 4, margin: "0 auto", background: "linear-gradient(135deg, #E0F7FA, #B3E5FC)", borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ background: "linear-gradient(135deg, #81D4FA, #4FC3F7)" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Author</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Genre</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id} sx={{ '&:hover': { backgroundColor: "#E0F7FA" } }}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>{book.description}</TableCell>
                                <TableCell>
                                    {/*View Groups button*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            mr: 1,
                                            '&:hover': { background: "#29B6F6" },
                                        }}
                                        startIcon={<Visibility />}
                                        onClick={() => {
                                            fetchGroupsForBooks(book.id);
                                            setSelectedBook(book);
                                        }}
                                    >
                                        View Groups
                                    </Button>

                                    {/*Create Groups Button*/}
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '&:hover': { background: "#81D4FA" },
                                        }}
                                        startIcon={<Group />}
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Create Group
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
 
            {/* Groups for selected book - displayed when clicked on View groups*/}
            {selectedBook && (
                <Box sx={{ mt: 4, width: "100%" }}>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
                        Groups for: {selectedBook.title}
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxWidth: "80%", margin: "0 auto", background: "linear-gradient(135deg, #E0F7FA, #B3E5FC)" }}>
                        <Table>
                            <TableHead sx={{ background: "linear-gradient(135deg, #81D4FA, #4FC3F7)" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Group Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Member Count</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Members</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Reading Goals</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groups.map((group) => (
                                    <TableRow key={group.id} sx={{ '&:hover': { backgroundColor: "#E0F7FA" } }}>
                                        <TableCell>{group.name}</TableCell>
                                        <TableCell>{group.members.length}</TableCell>
                                        <TableCell>{group.members.map((member) => member.username).join(", ")}</TableCell>
                                        <TableCell>{group.reading_goals}</TableCell>
                                        <TableCell>
                                            {/*Join Group Button*/}
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    '&:hover': { background: "#388E3C" },
                                                }}
                                                startIcon={<Group />}
                                                onClick={() => handleCreateOrJoinGroup(group.name, selectedBook.id)}
                                            >
                                                Join Group
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
 
            {/* Dialog for Creating Group- opened when clicked on Create Group */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: {
                        background: "linear-gradient(135deg,rgb(122, 209, 235) 40%,rgb(148, 236, 211) 80%)",
                        borderRadius: "16px",
                        padding: "16px",
                    },
                }}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Group sx={{ marginRight: 1, color: "#00008B" }} />
                        Create a Group for {selectedBook?.title}
                    </Box>
                    <IconButton onClick={() => setOpenDialog(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {/*Group name input field in dialog*/}
                    <TextField
                        fullWidth
                        label="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {/*Reading goals input field in dialog*/}
                    <TextField
                        fullWidth
                        label="Reading Goals"
                        value={readingGoals}
                        onChange={(e) => setReadingGoals(e.target.value)}
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    {/*Cancel button in dialog*/}
                    <Button
                        onClick={() => setOpenDialog(false)}
                        sx={{ color: "#00008B" }}
                    >
                        Cancel
                    </Button>
                    {/*Create button in dialog for creating group*/}
                    <Button
                        variant="contained"
                        sx={{ background: "#00008B", '&:hover': { background: "#FF6F00" } }}
                        onClick={() => {
                            handleCreateOrJoinGroup(groupName, selectedBook.id, readingGoals);
                            setOpenDialog(false);
                        }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
 
export default BookSelectionPage;
