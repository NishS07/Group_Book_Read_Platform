//This component serves as the main landing page for the logged-in users(role member).
//It displays available books, user groups and notifications.
//Provides navigation option for book selection and member groups page.

import {
        AppBar,
        Toolbar,
        Typography,
        Box,
        IconButton,
        Avatar,
        Button,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        Badge,
        Menu,
        MenuItem,
    } from "@mui/material";
import { 
        Logout, 
        Book, 
        Groups, 
        MenuBook, 
        LocalLibrary, 
        Notifications 
    } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
 

const HomePage = () => {
    //initial state
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [books, setBooks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
 
    // Extract username from local storage, redirect to login page if not found
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            navigate("/");
        }
    }, [navigate]);
 
    //fetch books, groups, and notifications from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { Authorization: `Bearer ${token}` };
                
                //fetch available books
                const booksResponse = await axios.get("http://localhost:8087/api/books/", { headers });
                setBooks(booksResponse.data);
 
                //fetch available groups
                const groupsResponse = await axios.get("http://localhost:8087/api/groups/", { headers });
                setGroups(groupsResponse.data);

                //fetch notifications
                const notificationResponse = await axios.get("http://localhost:8087/api/chapter-deadline-notifications/", {headers});
                setNotifications(notificationResponse.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);
 
    // handle user logout 
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        navigate("/");
    };

    //handle notification menu
    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
 
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
            {/* AppBar with logo, title, username, notification bell and logout button */}
            <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", padding: 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <MenuBook sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{flexGrow: 1,fontSize: "1.55rem",}}>
                       Group Book Reading Club                     
                    </Typography>
                    <Typography variant="h6" sx={{flexGrow: 1,fontSize: "1.55rem",}}>
                         Member Home Page
                     </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body1" sx={{ mr: 2, fontSize: "1.55rem", fontWeight: 400 }}>
                            Welcome, {username}
                        </Typography>
                        <Avatar sx={{ bgcolor: "#ffffff", color: "#08B3E5" }}>
                            {username.charAt(0).toUpperCase()}
                        </Avatar>

                        {/*Notifications*/}
                        <IconButton
                            color="inherit"
                            onClick={handleNotificationClick}
                            sx={{color: "#ffffff"}}
                            title="Notifications"
                        >
                            <Badge badgeContent={notifications.length} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Menu   
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{mt: "45px"}}
                        >
                            {notifications.length === 0 ? (
                                <MenuItem onClick={handleClose}>No notifications</MenuItem>
                            ) : (
                                notifications.map((notification, index) => (
                                    <MenuItem key={index} onClick={handleClose}>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>
                                            {index+1}.{notification.notification}
                                        </Typography>
                                    </MenuItem>
                                ))
                            )}
                        </Menu>

                        {/*Logout*/}
                        <IconButton
                            color="inherit"
                            onClick={handleLogout}
                            sx={{ color: "#ffffff" }}
                            title="Logout"
                        >
                            <Logout />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
 
            {/* Main content */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    px: 3,
                    pt: 4,
                    textAlign: "center",
                }}
            >
                {/*Welcome section with some basic info for members*/}
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontFamily: "Georgia, serif" }}>
                    Welcome to Group Book Reading Club!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, fontSize: "1.1rem", fontFamily: "Verdana, sans-serif" }}>
                    Dive into the joy of reading with a vibrant community of book lovers.
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        maxWidth: "600px",
                        gap: 2,
                    }}
                >
                    <Typography variant="body1" sx={{ display: "flex", alignItems: "center", fontSize: "1rem" }}>
                        <Book sx={{ mr: 1 }} />
                        Explore books and join groups that match your interests.
                    </Typography>
                    <Typography variant="body1" sx={{ display: "flex", alignItems: "center", fontSize: "1rem" }}>
                        <LocalLibrary sx={{ mr: 1 }} />
                        Deadlines to stay on track with your reading goals.
                    </Typography>
                    <Typography variant="body1" sx={{ display: "flex", alignItems: "center", fontSize: "1rem" }}>
                        <Groups sx={{ mr: 1 }} />
                        Engage in discussions and share your thoughts with fellow readers.
                    </Typography>
                </Box>
            </Box>
 

 
            {/* Books Section */}
            <Typography
                variant="h5"
                sx={{
                    mb: 1,
                    textAlign: "center",
                    fontWeight: 600,
                    fontFamily: "Courier New, monospace",
                    mt: 3,
                }}
            >
                <Book sx={{ mr: 1, verticalAlign: "middle" }} />
                Available Books
            </Typography>

            {/*Button to go to Book selection page*/}
            <Button
                variant="contained"
                color="primary"
                sx={{
                    mb: 2,
                    ":hover": { backgroundColor: "#1C6DD0", color: "#ffffff" },
                }}
                onClick={() => navigate("/book-selection")}
            >
                Click here to Select a Book and to Join/Create Group
            </Button>

            {/*Table to show available books data*/}
            <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "0 auto", borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: "linear-gradient(135deg,rgb(81, 211, 225),rgb(99, 242, 225))" }}>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Author</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Genre</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book,index) => (
                            <TableRow
                                key={book.id}
                                sx={{
                                    background: index % 2 === 0 ? "linear-gradient(135deg, #F0F8FF, #E6F7FF)" : "linear-gradient(135deg, #E6F7FF, #D1F1F8)"
                                }}
                            >
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{book.title}</TableCell>
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{book.author}</TableCell>
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{book.genre}</TableCell>
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{book.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


 
            {/* Groups Section */}
            <Typography
                variant="h5"
                sx={{
                    mt: 4,
                    mb: 1,
                    textAlign: "center",
                    fontWeight: 600,
                    fontFamily: "Courier New, monospace",
                }}
            >
                <Groups sx={{ mr: 1, verticalAlign: "middle" }} />
                Available Groups
            </Typography>

            {/*Button to go to Members Group Page*/}
            <Button
                variant="contained"
                color="primary"
                sx={{
                    mb: 2,
                    ":hover": { backgroundColor: "#1C6DD0", color: "#ffffff" },
                }}
                onClick={() => navigate("/member-group-page")}
            >
                Check your groups here
            </Button>

            {/*Table to show available groups data*/}
            <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "0 auto", borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: "linear-gradient(135deg,rgb(81, 211, 225),rgb(99, 242, 225))" }}>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Group Name</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Book</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Members</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>Reading Goals</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {groups.map((group, index) => (
                            <TableRow
                                key={group.id}
                                sx={{
                                    background: index % 2 === 0 ? "linear-gradient(135deg, #F0F8FF, #E6F7FF)" : "linear-gradient(135deg, #E6F7FF, #D1F1F8)"
                                }}
                            >
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{group.name}</TableCell>
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{group.book.title}</TableCell>
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{group.members.length}</TableCell>
                                <TableCell sx={{ fontFamily: "Verdana, sans-serif" }}>{group.reading_goals}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
 
            {/*Footer*/}
            <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption">&copy; 2025 Group Book Reading Club | All rights reserved.</Typography>
            </Box>
        </Box>
    );
};
 
export default HomePage;