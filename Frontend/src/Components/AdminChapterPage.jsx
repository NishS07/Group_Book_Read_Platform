//This component allows admins to manage chapters.
//provides functionalities to create, edit and delete chapters while associating them with specific groups.
import { 
        Box, 
        Button, 
        Typography, 
        TextField, 
        Select, 
        MenuItem, 
        InputLabel, 
        FormControl, 
        IconButton, 
        Table, 
        TableBody, 
        TableCell, 
        TableContainer, 
        TableHead, 
        TableRow, 
        Paper, 
        AppBar, 
        Toolbar, 
        InputAdornment 
    } from "@mui/material";
import { 
        MenuBook, 
        Edit, 
        Delete, 
        EventNote, 
        Group as GroupIcon, 
        Home 
    } from "@mui/icons-material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 

const AdminChapterPage = () => {
    //initial state
    const [chapters, setChapters] = useState([]);
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        deadline: null,
        group: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
 
    //fetch chapters and groups when component mounts
    useEffect(() => {
        fetchChapters();
        fetchGroups();
    }, []);
 
    //fetch chapters from API
    const fetchChapters = async () => {
        try {
            const response = await axios.get('http://localhost:9089/api/chapter/', { headers: { Authorization: `Bearer ${accessToken}` }, });
            setChapters(response.data);
        } catch (error) {
            console.error("Error fetching chapters: ", error);
        }
    };
 
    //fetch groups from API
    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:9089/api/groups-admin/', { headers: { Authorization: `Bearer ${accessToken}` }, });
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups: ", error);
        }
    };
 
    //handles input changes for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
 
    //handles date selection for the deadline field
    const handleDateChange = (date) => {
        setFormData({ ...formData, deadline: date });
    };
 
    //handles form submission for adding or editing a chapter
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                //updating existing chapter
                await axios.patch(`http://localhost:9089/api/chapter/${currentChapterId}/update/`, { ...formData, deadline: dayjs(formData.deadline).format("YYYY-MM-DD") }, { headers: { Authorization: `Bearer ${accessToken}` }, });
            } else {
                //create new chapter
                await axios.post('http://localhost:9089/api/chapter/create/', { ...formData, deadline: dayjs(formData.deadline).format("YYYY-MM-DD") }, { headers: { Authorization: `Bearer ${accessToken}` }, });
            }
            fetchChapters(); //refresh chapter list
            resetForm(); //reset form fields
        } catch (error) {
            console.error("Error submitting chapter: ", error);
        }
    };
 
    //populates the form with chapter data for editing
    const handleEdit = (chapter) => {
        setFormData({
            title: chapter.title,
            deadline: dayjs(chapter.deadline),
            group: chapter.group,
        });
        setCurrentChapterId(chapter.id);
        setIsEditMode(true);
    };
 
    //deletes a chapter and refreshes the list
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9089/api/chapter/${id}/delete/`, { headers: { Authorization: `Bearer ${accessToken}` }, });
            fetchChapters(); //refresh chapter list
        } catch (error) {
            console.error("Error deleting chapter", error);
        }
    };
 
    //resets the form fields and exits edit mode
    const resetForm = () => {
        setFormData({ title: "", deadline: null, group: "" });
        setIsEditMode(false);
        setCurrentChapterId(null);
    };
 
    //navigate to admin home page
    const handleGoHome = () => {
        navigate("/adminhomepage");
    };
 
    return (
        //for adding calendar wraping datepicker with localization provider and setting date adapter
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)',
                    color: '#ffffff',
                }}
            >
                {/*header/app bar*/}
                <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", padding: 1 }}>
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <MenuBook sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Group Book Reading Club
                        </Typography>
                        {/*Go to home page button*/}
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleGoHome}
                            sx={{
                                color: "#ffffff",
                                borderColor: "#ffffff",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                },
                            }}
                        >
                            <Home sx={{ mr: 1 }} />Go to Home Page
                        </Button>
                    </Toolbar>
                </AppBar>
                {/*chapter management section*/}
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
                        Chapter Management
                    </Typography>
                    <Typography variant="h5" gutterBottom style={{ marginTop: "8px" }}>
                        Add/Edit Chapter Data
                    </Typography>
                    {/*form section*/}
                    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 600, marginBottom: 20 }}>
                        {/*textfield for chapter title*/}
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            margin="normal"
                            required
                            sx={{
                                "& .MuiInputBase-root": { color: "#ffffff" },
                                "& .MuiInputLabel-root": { color: "#ffffff" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MenuBook sx={{ color: "#ffffff" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/*date picker for setting deadline*/}
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label="Deadline"
                                value={formData.deadline}
                                format="YYYY-MM-DD"
                                onChange={handleDateChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        margin="normal"
                                        sx={{
                                            "& .MuiInputBase-root": { color: "#ffffff" },
                                            "& .MuiInputLabel-root": { color: "#ffffff" },
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                                            "& .MuiSvgIcon-root": { color: "#ffffff" },
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        {/*drop down to select group*/}
                        <FormControl fullWidth margin="normal">
                            <InputLabel sx={{ color: "#ffffff", display: 'flex', alignItems: 'center' }}>
                                <GroupIcon sx={{ mr: 1 }} />Group
                            </InputLabel>
                            <Select
                                name="group"
                                value={formData.group}
                                onChange={handleChange}
                                required
                                sx={{
                                    color: "#ffffff",
                                    "& .MuiSelect-icon": { color: "#ffffff" },
                                    "& .MuiInputBase-root": { color: "#ffffff" },
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
                                }}
                            >
                                {groups.map((group) => (
                                    <MenuItem key={group.id} value={group.id}>Group: {group.name} - Book: {group.book.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/*Add Chapter/Update Chapter button*/}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {isEditMode ? "Update Chapter" : "Add Chapter"}
                        </Button>
                    </form>
                    {/*Chapter list table- title, deadline, group name, book title, actions(edit/delete)*/}
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
                                        Chapter Title
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                    >
                                        Deadline
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                    >
                                        Group Name
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                    >
                                        Book Title
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: "bold", fontSize: "16px", color: "#ffffff", textAlign: "center" }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        <TableBody>
                            {chapters.map((chapter, index) => {
                                const group = groups.find((g) => g.id === chapter.group);
                                    return (
                                        <TableRow
                                            key={chapter.id}
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
                                            <TableCell sx={{ textAlign: "center" }}>{chapter.title}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{chapter.deadline}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{group?.name || ""}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{group?.book?.title || ""}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                {/*edit icon*/}
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(chapter)}
                                                    title="Edit"
                                                    sx={{
                                                        "&:hover": {
                                                        color: "#1976d2",
                                                        },
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                {/*delete icon*/}
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleDelete(chapter.id)}
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
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
 
                </Box>
                {/*footer*/}
                <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="caption">&copy; 2025 Group Book Reading Club | All rights reserved.</Typography>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};
 
export default AdminChapterPage;
