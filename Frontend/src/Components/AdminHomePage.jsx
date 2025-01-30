//This component serves as the main dashboard for administrators of the Group Book Reading Club.
//Provides navigation options to manage books, groups, and chapters.
import { 
        AppBar, 
        Toolbar, 
        Typography, 
        Box, 
        IconButton, 
        Avatar, 
        Button, 
        Grid2 
    } from "@mui/material";
import { 
        Logout, 
        MenuBook, 
        LibraryBooks, 
        Group, 
        AutoStories 
    } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";


const AdminHomePage = () => {
    //initial state
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    
    //extract username from local storage, redirect to login page if no username found
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername){
            setUsername(storedUsername);
        }
        else
        {
            navigate('/');
        }
    },[navigate]);
    

    //logout function- clearing data from local storage and navigating to the login page
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        navigate('/');
    };

    //navigation handlers for books, groups and chapters
    const navigateToBooks = () => navigate('/admin/books');
    const navigateToGroups = () => navigate('/admin/groups');
    const navigateToChapters = () => navigate('/admin/chapters');

    return(
        <Box 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)',
                color: '#ffffff',
            }}
        >
            {/*AppBar with username and logout button */}
            <AppBar position="static" sx={{background: 'transparent', boxShadow: 'none', padding: 1}}>
                <Toolbar sx={{ justifyContent: 'space-between'}}>
                    <MenuBook sx={{mr: 1}} />
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Group Book Reading Club
                    </Typography>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Admin Home Page
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body1" sx={{mr: 2}}>
                            Welcome, {username} {/*display username*/}
                        </Typography>
                        <Avatar sx={{bgcolor: '#ffffff', color:'#08B3E5'}}>
                            {username.charAt(0).toUpperCase()} {/*creating name avatar*/}
                        </Avatar>

                        {/*Logout button*/}
                        {/*inherit color from its parent element's text color*/}
                        <IconButton 
                            color="inherit" 
                            onClick={handleLogout}
                            sx={{color: '#ffffff'}}
                            title="Logout"
                        >
                            <Logout />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/*Main content*/}
            <Box 
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    px: 3,
                    pt: 4,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to Group Book Reading Club!
                </Typography> 
                <Typography variant="h6" gutterBottom>
                    What would you like to manage today?
                </Typography>

                {/*Navigation Buttons for different management sections*/}
                <Grid2 container spacing={3} justifyContent="center" sx={{mt: 3}}>
                    <Grid2 item>
                        {/*Manage Books button*/}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<LibraryBooks />}
                            onClick={navigateToBooks}
                            sx={{
                                backgroundColor: "#ffffff",
                                color: '#08B3E5',
                                '&:hover':{
                                    backgroundColor: '#e0f7fa',
                                },
                                fontWeight: 'bold',
                            }}
                        >
                            Manage Books
                        </Button>
                    </Grid2>
                    <Grid2 item>
                        {/*Manage Groups button*/}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Group />}
                            onClick={navigateToGroups}
                            sx={{
                                backgroundColor: "#ffffff",
                                color: '#08B3E5',
                                '&:hover':{
                                    backgroundColor: '#e0f7fa',
                                },
                                fontWeight: 'bold',
                            }}
                        >
                            Manage Groups
                        </Button>
                    </Grid2>
                    <Grid2 item>
                        {/*Manage Chapters button*/}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AutoStories />}
                            onClick={navigateToChapters}
                            sx={{
                                backgroundColor: "#ffffff",
                                color: '#08B3E5',
                                '&:hover':{
                                    backgroundColor: '#e0f7fa',
                                },
                                fontWeight: 'bold',
                            }}
                        >
                            Manage Chapters
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
            {/*Footer*/}
            <Box sx={{textAlign: 'center', py: 2}}>
                <Typography variant="caption">&copy; 2025 Group Book Reading Club | All rights reserved.</Typography>
            </Box>
        </Box>
    );
};
export default AdminHomePage;
