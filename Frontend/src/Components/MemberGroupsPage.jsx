//This component displays a list of groups the user(role member) is a part of. 
//User can navigate to a group's details page from here

import { useEffect, useState } from "react";
import { 
        Box, 
        Typography, 
        Table, 
        TableBody, 
        TableCell, 
        TableContainer, 
        TableHead, 
        TableRow, 
        Button, 
        Paper 
      } from "@mui/material";
import { 
        Group, 
        Book, 
        ArrowBack 
      } from "@mui/icons-material";
import { useNavigate } from "react-router";
import axios from "axios";

 
const YourGroupsPage = () => {
  //initial state
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 

  //fetch user's group from the API
  useEffect(() => {
    const fetchMemberGroups = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("http://localhost:8087/api/member/groups/", { headers });
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching member groups:", error);
        setLoading(false);
      }
    };
    fetchMemberGroups();
  }, []);
 
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
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/*Back Home button*/}
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

      {/*Page title*/}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", fontSize: "2rem" }}>
        Your Groups <Group sx={{ fontSize: 28, ml: 1 }} />
      </Typography>
 
      {/*displays loading message while fetching data*/}
      {loading ? (
        <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "300" }}>Loading...</Typography>
      ) : groups.length > 0 ? (

        //display table if group exists
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "80%",
            mt: 3,
            background: "linear-gradient(135deg, #F0F8FF, #E6F7FF)",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: 2,
          }}
        >
          <Table>
            <TableHead sx={{ background: "linear-gradient(135deg, #A6E1E8, #B6F8F0)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>Group Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group, index) => (
                <TableRow key={group.id} sx={{ background: index % 2 === 0 ? "linear-gradient(135deg, #F0F8FF, #E6F7FF)" : "linear-gradient(135deg, #E6F7FF, #D1F1F8)" }}>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: "500" }}>{group.name}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: "500" }}>{group.book.title}</TableCell>
                  <TableCell>
                    {/*View details button for that particular group in each row,
                     navigates to groups page with group id as query params */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/groups/${group.id}`)}
                      startIcon={<Book />}
                      sx={{
                        background: "#22E4AC",
                        '&:hover': {
                          background: "#1AB98A",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        },
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        //Show message when no groups are found
        <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "300" }}>
          You are not part of any group yet.
        </Typography>
      )}
    </Box>
  );
};
 
export default YourGroupsPage;
