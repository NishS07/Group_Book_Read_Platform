//This component manages book reading groups in admin panel. 
//It allows users to create, update, and delete groups, assign books, and add members.

import { useState, useEffect } from "react";
import axios from "axios";
import { 
        TextField, 
        Button, 
        Table, 
        TableBody, 
        TableCell, 
        TableContainer, 
        TableHead, 
        TableRow, 
        Paper, 
        MenuItem, 
        Select, 
        InputLabel, 
        FormControl, 
        Chip, 
        Box, 
        AppBar, 
        Toolbar, 
        Typography, 
        IconButton, 
        InputAdornment  
    } from "@mui/material";
import { 
        MenuBook, 
        Edit, 
        Delete, 
        Group, 
        Book, 
        CheckCircle, 
        Home 
    } from "@mui/icons-material"; 
import { useNavigate } from "react-router";
 
const AdminGroupPage = () => {
    //initial state
    const [groups, setGroups] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({id: null, name:"", reading_goals: "", book: "", members: [],});
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();
 
    //fetch groups, books, and members on component mount
    useEffect(() => {
        fetchGroups();
        fetchBooks();
        fetchMembers();
    }, []);
 
    //fetch groups data from API
    const fetchGroups = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.get("http://localhost:8087/api/groups-admin/", {headers: {Authorization: `Bearer ${accessToken}`}});
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch groups.");
        }
    };
 
    //fetch book data from API
    const fetchBooks = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.get("http://localhost:8087/api/books-admin/", {headers: {Authorization: `Bearer ${accessToken}`}});
            setBooks(response.data);
        } catch (error) {
            console.error("Failed to fetch books");
        }
    };
 
    //fetch members data from API
    const fetchMembers = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.get("http://localhost:8087/api/users/", {headers: {Authorization: `Bearer ${accessToken}`}});
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch members.");
        }
    };
 
    //handle input changes for form
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
 
    //handle multi-select input for members
    const handleMultipleSelectChange = (e) => {
        setFormData({...formData, members: e.target.value});
    };
 
    //handle form submission for creating/updating groups
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            reading_goals: formData.reading_goals,
            book: {id: formData.book},
            members: formData.members.map((username) => ({username})),
        };
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (isEdit) {  
                //update existing group
                await axios.patch(`http://localhost:8087/api/groups/${formData.id}/update/`, payload, {headers: {Authorization: `Bearer ${accessToken}`}});
            } else {
                //create new group
                await axios.post("http://localhost:8087/api/groups/create/", payload, {headers: {Authorization: `Bearer ${accessToken}`}});
            }
            //reset form and refresh group list
            setFormData({id: null, name: "", reading_goals: "", book: "", members: []});
            setIsEdit(false);
            fetchGroups();
        } catch (error) {
            console.error("Failed to save groups");
        }
    };
 
    //load group data into form for editing
    const handleEdit = (group) => {
        setFormData({
            id: group.id,
            name: group.name,
            reading_goals: group.reading_goals,
            book: group.book.id,
            members: group.members.map((member) => member.username),
        });
        setIsEdit(true);
    };
 
    //delete group
    const handleDelete = async (id) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            await axios.delete(`http://localhost:8087/api/groups/${id}/delete/`, {headers: {Authorization: `Bearer ${accessToken}`}});
            fetchGroups();
        } catch (error) {
            console.error("Failed to delete group.");
        }
    };
 
    //Navigate to admin homepage
    const handleGoHome = () => {
        navigate("/adminhomepage");
    };
 
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)',
                color: '#ffffff',
            }}
        >
            {/*header section*/}
            <AppBar position="static" sx={{background: "transparent", boxShadow:"none", padding: 1}}>
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <MenuBook sx={{mr: 1}} />
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Group Book Reading Club
                    </Typography>
                    {/*Go to Home page button*/}
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
 
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                px: 3,
                pt: 4,
            }}>
                <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginBottom: "16px" }}>
                    Group Management
                </Typography>
                <Typography variant="h5" gutterBottom style={{ marginTop: "8px" }}>
                    Add/Edit Group Data
                </Typography>
                {/*form section*/}
                <form onSubmit={handleSubmit} style={{width: "100%", maxWidth: 600, marginBottom: 20}}>
                    {/*textfield for group name*/}
                    <TextField
                        fullWidth
                        label="Group Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <Group  sx={{ color:"white"}}/>
                                </InputAdornment>
                            ),
                        }}
                            sx={{
                                    "& .MuiInputBase-root": { color: "#ffffff" },
                                    "& .MuiInputLabel-root": { color: "#ffffff" },
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                                }}
                    />
 
                    {/*textfield for reading goals*/}
                    <TextField
                        fullWidth
                        label="Reading Goals"
                        name="reading_goals"
                        value={formData.reading_goals}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <CheckCircle  sx={{ color:"white"}}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                                "& .MuiInputBase-root": { color: "#ffffff" },
                                "& .MuiInputLabel-root": { color: "#ffffff" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                        }}
                    />
                    {/*drop down to select book*/}
                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{color: "#ffffff", display: 'flex', alignItems: 'center'}}>
                            <Book sx={{mr: 1}} />
                                Book
                        </InputLabel>
                        <Select
                            name="book"
                            value={formData.book}
                            onChange={handleInputChange}
                            required
                            sx={{
                                color: "#ffffff",
                                "& .MuiSelect-icon": {color: "#ffffff"},
                                "& .MuiInputBase-root" : {color: "#ffffff"},
                                "& .MuiOutlinedInput-notchedOutline": {borderColor: "#ffffff"},
                            }}
                        >
                            {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>{book.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    {/*Multi select drop down for selecting group members*/}
                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{color: "#ffffff", display: 'flex', alignItems: 'center'}}>
                            <Group sx={{mr: 1}} />
                                Members
                        </InputLabel>
                        <Select
                            multiple
                            required
                            name="members"
                            value={formData.members}
                            onChange={handleMultipleSelectChange}
                            renderValue={(selected) => (
                                <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                    {selected.map((username) => (
                                        <Chip 
                                            key={username} 
                                            label={username} 
                                            sx={{
                                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                    color: "#ffffff",
                                                    border: "1px solid #ffffff",
                                            }}/>
                                    ))}
                                </Box>
                            )}
                            sx={{
                                    color: "#ffffff",
                                    "& .MuiSelect-icon": {color: "#ffffff"},
                                    "& .MuiInputBase-root" : {color: "#ffffff"},
                                    "& .MuiOutlinedInput-notchedOutline": {borderColor: "#ffffff"},
                            }}
                        >
                            {members.map((member) => (
                                <MenuItem key={member.id} value={member.username}>
                                    {member.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
 
                    {/*Create Group/Update Group button*/}
                    <Button type="submit" variant="contained" color="primary">
                        {isEdit ? "Update Group" : "Create Group"}
                    </Button>
                </form>
 
                {/*table section-display group name, reading goals, book, members, actions(edit and delete)*/}
                <TableContainer
                    component={Paper}
                    sx={{
                        maxWidth: 1000,
                        marginTop: 3,
                        background: "linear-gradient(135deg, #ffffff, #f2f2f2)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{background: "linear-gradient(135deg, #22E4AC, #08B3E5)"}}>
                                <TableCell sx={{fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center"}}>Group Name</TableCell>
                                <TableCell sx={{fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center"}}>Reading Goals</TableCell>
                                <TableCell sx={{fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center"}}>Book</TableCell>
                                <TableCell sx={{fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center"}}>Members</TableCell>
                                <TableCell sx={{fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center"}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groups.map((group, index) => (
                                <TableRow
                                    key={group.id}
                                    sx={{
                                        background: index % 2 === 0 ? "linear-gradient(135deg, #f9f9f9, #e8f5e9)" : "linear-gradient(135deg, #f5f5f5, #e3f2fd)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #ffffff, #c8e6c9)",
                                        },
                                        transition: "background-color 0.3s ease",
                                    }}
                                >
                                    <TableCell sx={{ textAlign: "center" }}>{group.name}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{group.reading_goals}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{group.book.title}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        {group.members.map((member) => member.username).join(", ")}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <IconButton color="primary" onClick={() => handleEdit(group)} title="Edit" sx={{"&:hover": {color: "#1976d2"}}}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(group.id)} title="Delete" sx={{"&:hover": {color: "#d32f2f"}}}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
 
            {/*Footer section*/}
            <Box sx={{textAlign: "center", py: 2}}>
                <Typography variant="caption">&copy; 2025 Group Book Reading Club | All rights reserved.</Typography>
            </Box>
        </Box>
    );
};
 
export default AdminGroupPage;