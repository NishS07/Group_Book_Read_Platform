//This component allows admin to perform all CRUD operations for books

import { useState, useEffect } from "react";
import { 
        AppBar, 
        Toolbar, 
        Typography, 
        Box, 
        IconButton, 
        Button, 
        TextField, 
        Table, 
        TableBody, 
        TableCell, 
        TableContainer, 
        TableHead, 
        TableRow, 
        Paper, 
        InputAdornment 
    } from "@mui/material";
import { 
        MenuBook, 
        Edit, 
        Delete, 
        Title, 
        Person, 
        Category, 
        Description, 
        Home 
    } from "@mui/icons-material";
import { useNavigate } from "react-router";
import axios from "axios";
 
const AdminBookPage = () => {
    //initial state
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({ title: "", author: "", genre: "", description: "" });
    const [editMode, setEditMode] = useState(false);
    const [editBookId, setEditBookId] = useState(null);
 
    //extract username from local storage, redirect to login page if no username found
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            navigate("/");
        }
    }, [navigate]);
 
    //fetch book data from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:9089/api/books-admin/", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books", error);
            }
        };
        fetchBooks();
    }, []);
 
    //handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
 
    //handle form submission for adding and updating books
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");
        if (editMode) {
            try {
                //update existing book data
                const response = await axios.patch(
                    `http://localhost:9089/api/books/${editBookId}/update/`,
                    formData,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                //updating existing book data based on book id
                setBooks((prevBooks) =>
                    prevBooks.map((book) => (book.id === editBookId ? response.data : book))
                );

                //clear edit mode flag, book id and form fields after update
                setEditMode(false);
                setEditBookId(null);
                setFormData({ title: "", author: "", genre: "", description: "" });
            } catch (error) {
                console.error("Error updating book", error);
            }
        } else {
            try {
                //adding new book data
                const response = await axios.post("http://localhost:9089/api/books/create/", formData, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                //new book entry
                setBooks((prevBooks) => [...prevBooks, response.data]);
                //clearing form fields after adding data
                setFormData({ title: "", author: "", genre: "", description: "" });
            } catch (error) {
                console.error("Error creating book", error);
            }
        }
    };
 
    //delete a book from the list
    const handleDelete = async (bookId) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            await axios.delete(`http://localhost:9089/api/books/${bookId}/delete/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            //removing from available books
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        } catch (error) {
            console.error("Error deleting book", error);
        }
    };
 
    //enable edit mode and populate form with book data
    const handleEdit = (book) => {
        setEditMode(true);
        setEditBookId(book.id);
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre,
            description: book.description,
        });
    };
 
    //navigate back to admin home page
    const handleGoHome = () => {
        navigate("/adminhomepage");
    };
 
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)",
                color: "#ffffff",
            }}
        >
            {/*AppBar with site title and home button*/}
            <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", padding: 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <MenuBook sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Group Book Reading Club
                    </Typography>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleGoHome}
                        startIcon={<Home />}
                        sx={{
                            color: "#ffffff",
                            borderColor: "#ffffff",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                            },
                        }}
                    >
                        Go to Home Page
                    </Button>
                </Toolbar>
            </AppBar>
            {/*Main content section*/}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    px: 3,
                    pt: 4,
                }}
            >
                <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginBottom: "16px" }}>
                    Book Management
                </Typography>
                <Typography variant="h5" gutterBottom style={{ marginTop: "8px" }}>
                    Add/Edit Books Data
                </Typography>
                {/*Book Input Form*/}
                <form
                    onSubmit={handleFormSubmit}
                    style={{ width: "100%", maxWidth: 600, marginBottom: 20 }}
                >
                    {/*textfield for book title*/}
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Title  sx={{ color:"white"}}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root": { color: "#ffffff" },
                            "& .MuiInputLabel-root": { color: "#ffffff" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                        }}
                    />

                    {/*textfield for book author*/}
                    <TextField
                        fullWidth
                        label="Author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person sx={{ color:"white"}} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root": { color: "#ffffff" },
                            "& .MuiInputLabel-root": { color: "#ffffff" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                        }}
                    />

                    {/*textfield for book genre*/}
                    <TextField
                        fullWidth
                        label="Genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Category sx={{ color:"white"}} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root": { color: "#ffffff" },
                            "& .MuiInputLabel-root": { color: "#ffffff" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                        }}
                    />

                    {/*textfield for book description*/}
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Description sx={{ color:"white"}}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root": { color: "#ffffff" },
                            "& .MuiInputLabel-root": { color: "#ffffff" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                        }}
                    />

                    {/*Button for Add Book/Update Book*/}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 2,
                            "&:hover": {
                                backgroundColor: "#1976d2",
                            },
                        }}
                    >
                        {editMode ? "Update Book" : "Add Book"}
                    </Button>
                </form>
 
                {/*Table displaying books data*/}
                <TableContainer 
                    component={Paper}
                    sx={{
                        maxWidth: 800,
                        marginTop: 3,
                        background: "linear-gradient(135deg, #ffffff, #f2f2f2)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: "linear-gradient(135deg, #22E4AC, #08B3E5)",
                                }}
                            >
                                <TableCell
                                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                >
                                    Title
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                >
                                    Author
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                >
                                    Genre
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book, index) => (
                                <TableRow
                                    key={book.id}
                                    sx={{
                                        background: index % 2 === 0
                                            ? "linear-gradient(135deg, #f9f9f9, #e8f5e9)"
                                            : "linear-gradient(135deg, #f5f5f5, #e3f2fd)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #ffffff, #c8e6c9)",
                                        },
                                        transition: "background-color 0.3s ease",
                                    }}
                                >
                                    <TableCell sx={{ textAlign: "center" }}>{book.title}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{book.author}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{book.genre}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{book.description}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        {/*Edit Icon*/}
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(book)}
                                            title="Edit"
                                            sx={{
                                                "&:hover": {
                                                    color: "#1976d2",
                                                },
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        {/*Delete Icon*/}
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDelete(book.id)}
                                            title="Delete"
                                            sx={{
                                                "&:hover": {
                                                    color: "#d32f2f",
                                                },
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/*Footer*/}
            <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption">
                    &copy; 2025 Group Book Reading Club | All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};
export default AdminBookPage;