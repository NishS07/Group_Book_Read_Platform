//This component handles user sign-up functionality, allowing new users to register

import { useState } from "react";
import { 
        Box, 
        Button, 
        Typography, 
        Alert, 
        InputAdornment, 
        FormControl, 
        Input, 
        Select, 
        MenuItem 
    } from "@mui/material";
import { 
        MenuBook, 
        Person, 
        Email, 
        Lock, 
        AppRegistrationRounded 
    } from "@mui/icons-material";
import { useNavigate } from "react-router";
import axios from "axios";


const SignUpPage = () => {
    //initial state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState("member");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    //handle user signup
    const handleSignup = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        //check if passwords match
        if(password !== confirmPassword){
            setError('Passwords do not match.');
            return;
        }

        //try-catch to handle exceptions
        try{
            //send user registration data to backend API
            const response = await axios.post('http://localhost:8087/api/register/',{
                username,
                email,
                password,
                role,
            });

            //On successful sign-up, show success message and redirect to login page after a second
            if(response.status === 201){
                setSuccess('Signup successful! Redirecting to the login page...');
                setTimeout(() => navigate("/"), 1000);
            }
        }
        catch (err){
            if(err.response && err.response.data){
                const errorData = err.response.data;
                if(errorData.username){
                    setError(errorData.username[0]);
                }
                else if(errorData.email){
                    setError(errorData.email[0]);
                }
                else if(errorData.password){
                    setError(errorData.password[0]);
                }
                else{
                    setError('Signup failed. Please check your details and try again.');
                }
            }
            else{
                setError('Signup failed. Please try again');
            }
        }
    };

    return(
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
                {/*Page header with logo and title*/}
                <Box sx={{display: "flex", alignItems: "center", mb: 3, textAlign: 'center'}}>
                    <MenuBook sx={{fontSize: 40, mr: 1, color: "#fff"}} />
                        <Typography variant="h3" fontWeight="bold">
                            Group Book Reading Club
                        </Typography>
                </Box>

                 {/*Sign-up title*/}               
                <Box sx={{display: "flex", alignItems: "center", mb:2}}>
                    <AppRegistrationRounded sx={{fontSize: 30, mr: 1}} />
                        <Typography variant="h5" fontWeight="bold">
                            Sign Up
                        </Typography>
                </Box>

                {/*success message*/}
                {success && (
                    <Alert severity="success" sx={{mb: 2, width: '300px'}}>
                        {success}
                    </Alert>
                )}

                {/*error message*/}
                {error && (
                    <Alert severity="error" sx={{mb: 2, width: '300px'}}>
                        {error}
                    </Alert>
                )}

                {/*Sign-up form*/}
                <Box
                    component="form"
                    onSubmit={handleSignup}
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
                    {/*Username input field*/}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Input
                            required
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            }
                        />  
                    </FormControl>

                    {/*Email input field*/}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Input
                            required
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            }
                        />  
                    </FormControl>

                    {/*Password input field*/}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Input
                            required
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            }
                        />  
                    </FormControl>

                    {/*Confirm Password input field*/}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Input
                            required
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            }
                        />  
                    </FormControl>

                    {/*Role selection drop down*/}
                    <Typography variant="subtitle1" color="gray" sx={{fontWeight: "bold", mt:1}}>
                        Select Role
                    </Typography>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <Select 
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="member">Member</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    {/*Sign Up button*/}
                    <Button 
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundImage: 'linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)',
                            color: '#fff',
                        }}>
                        Sign Up
                    </Button> 

                    {/*Back to Login button*/}
                    <Button 
                        variant="text"
                        color="primary"
                        onClick={() => navigate("/")}
                    >
                        Back to Login
                    </Button>
                </Box>
        </Box>
    );
};
export default SignUpPage;