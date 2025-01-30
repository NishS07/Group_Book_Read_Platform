//This component displays details of a specific reading group
//Shows list of chpaters along with deadlines and reading progress
//Allows users to mark chapters as read/unread
//Enable navigation to chapter discussions

import React, { useEffect, useState } from "react";
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
        Chip,
        LinearProgress,
      } from "@mui/material";
import { 
        GroupAdd,  
        ChatBubbleOutline 
      } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

 
const GroupPage = () => {
  //extract groupId from the URL
  const { groupId } = useParams();
  const navigate = useNavigate();
  //initial state
  const [group, setGroup] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
 
  //fetch group and progress data
  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
 
      // Fetch user ID
      const userResponse = await axios.get("http://localhost:9089/api/user-id/", { headers });
      setUserId(userResponse.data.userId);
 
      // Fetch group details
      const groupResponse = await axios.get(`http://localhost:9089/api/groups/${groupId}/`, {
        headers,
      });
      setGroup(groupResponse.data);
 
      // Fetch progress details for chapters
      const chaptersResponse = await axios.get("http://localhost:9089/api/progress/", { headers });
      const groupProgress = chaptersResponse.data.find(
        (g) => g.group_id === parseInt(groupId, 10)
      );
      if (groupProgress) {
        setChapters(groupProgress.chapters);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };
 
  //fetch data when component mounts or group Id changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProgressData();
      setLoading(false);
    };
 
    fetchData();
  }, [groupId]);
 

  //toggle read/unread status of a chapter
  const toggleChapterReadStatus = async (chapterId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
 
      // send request to toggle chapter status
      await axios.put(`http://localhost:9089/api/groups/${groupId}/chapter/${chapterId}/`, {}, { headers });
 
      // Refetch the progress data to ensure consistency
      await fetchProgressData();
    } catch (error) {
      console.error("Error toggling chapter read status:", error);
    }
  };
 
  //Navigate to chapter discussion page passing groupId and chapterId as query params
  const handleDiscussionClick = (chapterId) => {
    navigate(`/groups/${groupId}/chapters/${chapterId}/discussion`);
  };
 
  //shows loading screen while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #08B3E5 30%, #22E4AC 90%)",
          color: "#ffffff",
        }}
      >
        <Typography variant="h6">Loading group details...</Typography>
      </Box>
    );
  }
 
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
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {/*Navigation button to view all groups/ go to members group page*/}
        <Button
          variant="outlined"
          startIcon={<GroupAdd />}
          onClick={() => navigate("/member-group-page")}
          sx={{
            color: "#ffffff",
            borderColor: "#ffffff",
            '&:hover': {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          All Groups
        </Button>
      </Box>

      {/*Group Details Section*/}
      {group ? (
        <>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
            {group.name}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontStyle: "italic" }}>
            Book: {group.book.title} by {group.book.author}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontWeight: "400" }}>
            Reading Goals: {group.reading_goals}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Members:
          </Typography>
          {/*Members list*/}
          <Box sx={{
            mb: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            background: "linear-gradient(135deg,rgb(239, 242, 242), #B2EBF2)",
            padding: 2,
            borderRadius: 1
          }}>
            {group.members.map((member) => (
              <Chip
                key={member.id}
                label={member.username}
                sx={{
                  background: "#ffffff",
                  color: "#283E51",
                  '&:hover': {
                    backgroundColor: "#22E4AC",
                    color: "#ffffff",
                  },
                  fontWeight: "500",
                }}
              />
            ))}
          </Box>
 
          {/*Chapters table*/}
          <TableContainer component={Paper} sx={{ maxWidth: "80%", background: "linear-gradient(135deg, #F0F8FF, #E6F7FF)", borderRadius: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Table>
              <TableHead sx={{ background: "linear-gradient(135deg, #A6E1E8, #B6F8F0)" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Chapter</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Deadline</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Group Progress</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "200px" }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Discussion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chapters.map((chapter) => {
                  const isReadByUser = chapter.read_users.some((user) => user.id === userId);
                  return (
                    <TableRow
                      key={chapter.chapter_id}
                      sx={{
                        '&:hover': {
                          backgroundColor: "#E6F7FF",
                          cursor: "pointer",
                        },
                        background: "#fff",
                      }}
                    >
                      {/*Chapter title and deadline*/}
                      <TableCell>{chapter.title}</TableCell>
                      <TableCell>{chapter.deadline || "No deadline"}</TableCell>

                      {/*Read/Unread Status*/}
                      <TableCell>
                        <Chip label={isReadByUser ? "Read" : "Unread"} color={isReadByUser ? "success" : "default"} />
                      </TableCell>

                      {/*Progress Bar with total percentage value*/}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LinearProgress variant="determinate" value={chapter.read_percentage} sx={{ width: "100%" }} />
                          <Typography variant="body2">{Math.round(chapter.read_percentage)}%</Typography>
                        </Box>
                      </TableCell>

                      {/*Button to toggle Read/Unread*/}
                      <TableCell>
                        <Button
                          variant="contained"
                          color={isReadByUser ? "secondary" : "primary"}
                          onClick={() => toggleChapterReadStatus(chapter.chapter_id)}
                          sx={{
                            width: "100%",
                            '&:hover': {
                              background: isReadByUser ? "#FF7043" : "#22E4AC",
                            },
                          }}
                        >
                          Mark as {isReadByUser ? "Unread" : "Read"}
                        </Button>
                      </TableCell>

                      {/*Button to navigate to chapter discussion page*/}
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleDiscussionClick(chapter.chapter_id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            fontSize: "0.875rem",
                            '&:hover': {
                              background: "#B2EBF2",
                            },
                          }}
                        >
                          <ChatBubbleOutline />
                          Go to Discussion
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography variant="h6">Group not found.</Typography>
      )}
    </Box>
  );
};
 
export default GroupPage;