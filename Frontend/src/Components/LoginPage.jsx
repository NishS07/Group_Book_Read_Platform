//This component handles user login functionality

//Importing required modules
import { useState } from "react";
import { 
        Box, 
        Button, 
        Typography, 
        Link, 
        FormControl, 
        Input, 
        InputAdornment
    } from "@mui/material";
import Alert from "@mui/material/Alert";
import { 
        Person, 
        Lock, 
        MenuBook, 
        Login 
    } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router";


const LoginPage = () => {
    //initial state
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    //handle change in username and password fields
    const handleChange = (e) => {
        const{ name, value } = e.target;
        setFormData({ ...formData, [name]: value }); 
    };

    //handle login after username and password submitted by user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        //try-catch to handle exceptions
        try{
            //axios to connect to api endpoint developed to handle token generation through django DRF
            const response = await axios.post("http://localhost:8087/api/login/", {
                username: formData.username,
                password: formData.password,
            });
    
            const{ access, refresh } = response.data;
    
            //storing access token and refresh token in local storage
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            localStorage.setItem("username", formData.username);

            //fetch user role using the access token
            const roleResponse = await axios.get("http://localhost:8087/api/user-info/",{
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });

            const {role} = roleResponse.data;

            localStorage.setItem("role", role);
    
            //set success message and redirect to home page based on role(Admin/member) after a second
            setSuccess('Login successful! Redirecting to the home page...');
            if(role === "admin"){
                setTimeout(() => navigate("/adminhomepage"), 1000);
            }
            else if(role === "member"){
                setTimeout(() => navigate("/home"), 1000);
            }
            else{
                throw new Error("Invalid role");
            }
        }
        catch (err){
            //set error message on 401(unauthorized) response 
            if(err.response && err.response.status === 401){
                setError("Invalid username or password. Please try again.");
            }
            else{
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return(
        //outer box
        <Box
            sx={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                minHeight:"100vh" ,   
                background: 'linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)',
                color: '#ffffff',
            }}>
                {/*header*/}
                <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
                    <MenuBook sx={{fontSize: 40, mr: 1, color: "#fff"}} />
                        <Typography variant="h3" fontWeight="bold">
                            Group Book Reading Club
                        </Typography>
                </Box>
                                                
                <Box sx={{display: "flex", alignItems: "center", mb:2}}>
                    <Login sx={{fontSize: 30, mr: 1}} />
                        <Typography variant="h5" fontWeight="bold">
                            Login
                        </Typography>
                </Box>

                {/*success alert if set*/}
                {success && (
                    <Alert severity="success" sx={{mb:2, width:'300px'}}> 
                        {success}
                    </Alert>
                )}

                {/*error alert if any error*/}
                {error && (
                    <Alert severity="error" sx={{mb: 2, width: '300px'}}>
                        {error}
                    </Alert>
                )}
                
                {/*inner box(form) with username, password, login button and signup link fields*/}
                <Box 
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '300px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    {/*Username field*/}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Input
                            required
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            }
                        />  
                    </FormControl>

                    {/*Password field*/}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Input
                            required
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    {/*Login button*/}
                    <Button 
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundImage: 'linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)',
                            color: '#fff',
                        }}>
                        Login
                    </Button>

                    {/*Sign up link to create new account if already not any */}
                    <Typography mt={2} color="grey">
                        Don't have an account?{" "}
                        <Link href="/signup" underline="hover" color="primary">
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
        </Box>
    );
};
export default LoginPage;