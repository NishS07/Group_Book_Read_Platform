//This component handles the discussion threads for a specific chapter within a reading group.
//Users can view, post, and reply to discussions related to the chapter.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import {
        Card,
        CardContent,
        CardHeader,
        Typography,
        TextField,
        Button,
        Divider,
        Box,
      } from "@mui/material";
import { 
        Reply, 
        Send, 
      } from "@mui/icons-material";
 

const DiscussionPage = () => {
  //get groupId and chapterId from URL parameters
  const { groupId, chapterId } = useParams();
  const navigate = useNavigate();
 
  //initial state
  const [chapterDetails, setChapterDetails] = useState(null);
  const [discussionThreads, setDiscussionThreads] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [replyContent, setReplyContent] = useState({});
 
  //get authentication token from local storage
  const token = localStorage.getItem("accessToken");
  const authHeaders = { Authorization: `Bearer ${token}` };
 
  //fetch chapter details and discussion threads
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        //fetch chapter details
        const chapterResponse = await axios.get(
          `http://localhost:8087/api/groupchapter/${groupId}/chapter/${chapterId}/`,
          { headers: authHeaders }
        );
        setChapterDetails(chapterResponse.data);
        
        //fetch discussion threads
        const discussionResponse = await axios.get(
          `http://localhost:8087/api/groups/${groupId}/discussions_by_chapter/?chapter_id=${chapterId}`,
          { headers: authHeaders }
        );
        setDiscussionThreads(discussionResponse.data);
      } catch (error) {
        console.error("Error fetching discussion details: ", error);
      }
    };
    fetchDetails();
  }, [groupId, chapterId]);
 
  //handles adding new post
  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;
    try {
      //adding new post
      const response = await axios.post(
        `http://localhost:8087/api/groups/${groupId}/discussions_by_chapter/post/`,
        { chapter_id: chapterId, content: newPostContent },
        { headers: authHeaders }
      );

      //update discussion threads with new post
      setDiscussionThreads((prevThreads) => [...prevThreads, response.data]);

      //clear input field
      setNewPostContent("");
    } catch (error) {
      console.error("Error adding new post: ", error);
    }
  };
 
  //handles adding a reply to a post
  const handleAddReply = async (parentId) => {
    if (!replyContent[parentId]?.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:8087/api/groups/${groupId}/discussions_by_chapter/post/`,
        {
          chapter_id: chapterId,
          parent_id: parentId,
          content: replyContent[parentId],
        },
        { headers: authHeaders }
      );

      //update replies in the corresponding thread
      setDiscussionThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === parentId
            ? { ...thread, replies: [...thread.replies, response.data] }
            : thread
        )
      );

      //clear reply input field
      setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };
 

  //renders discussion threads and replies recursively
  const renderThreads = (threads) => {
    return threads.map((thread) => (
      <Card
        key={thread.id}
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          background: "linear-gradient(135deg, #A6E1E8, #B6F8F0)", 
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
        }}
      >
        {/*username*/}
        {/*date and time of post/reply creation*/}
        <CardHeader
          title={
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "600",
                fontFamily: "'Lora', serif",
                color: "#333",
              }}
            >
              {thread.user.username}
            </Typography>
          } 
          subheader={
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#555",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {new Date(thread.created_at).toLocaleString()}
            </Typography>
          }
        />
        <CardContent
          sx={{
            background: "linear-gradient(135deg, #F3F4F7, #FFFFFF)", 
            borderRadius: "12px",
            padding: "16px",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {/*post/reply content*/}
          <Typography sx={{ fontSize: "1.1rem", mb: 2 }}>
            {thread.content}
          </Typography>
          <Divider sx={{ my: 2 }} />
 
          {/*render replies recursively*/}
          {thread.replies && thread.replies.length > 0 && (
            <Box sx={{ pl: 4 }}>{renderThreads(thread.replies)}</Box>
          )}
 
          {/*reply input field*/}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a reply..."
              value={replyContent[thread.id] || ""}
              onChange={(e) =>
                setReplyContent((prev) => ({
                  ...prev,
                  [thread.id]: e.target.value,
                }))
              }
              sx={{ mb: 1, background: "#ffffff", borderRadius: "8px" }}
            />
            {/* Reply button */}
            <Button
              variant="contained"
              size="small"
              startIcon={<Reply />}
              onClick={() => handleAddReply(thread.id)}
              disabled={!replyContent[thread.id]?.trim()}
              sx={{
                background: "#22E4AC",
                color: "#ffffff",
                textTransform: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  background: "#1AB98A",
                },
              }}
            >
              Reply
            </Button>
          </Box>
        </CardContent>
      </Card>
    ));
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
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {/*button to navigate back to groups page*/}
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            color: "#ffffff",
            borderColor: "#ffffff",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <Reply sx={{ mr: 1 }} /> Back
        </Button>
      </Box>
 
      {/*Chapter details*/}
      {chapterDetails && (
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 1,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {/*Chapter Id and title*/}
            Chapter {chapterId}: {chapterDetails.title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontSize: "1.1rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {/*Chapter deadline*/}
            Deadline: {new Date(chapterDetails.deadline).toLocaleDateString()}
          </Typography>
        </Box>
      )}
 
      {/*Discussion Threads*/}
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Discussion Threads
        </Typography>
        {/*if discussion exists then render those else display "No discussions yet" message*/}
        {discussionThreads.length > 0 ? (
          renderThreads(discussionThreads)
        ) : (
          <Typography>No discussions yet. Be the first to start a conversation!</Typography>
        )}
      </Box>
 
      {/*Add New Post Section*/}
      <Box sx={{ mt: 4, width: "100%", maxWidth: "800px" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Add a New Post
        </Typography>
        {/*textfield for writing post*/}
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Write your post here..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          sx={{ mb: 2, background: "#ffffff", borderRadius: "8px" }}
        />
        {/*Post button*/}
        <Button
          variant="contained"
          onClick={handleAddPost}
          disabled={!newPostContent.trim()}
          sx={{
            background: "#22E4AC",
            color: "#ffffff",
            textTransform: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              background: "#1AB98A",
            },
          }}
        >
          <Send sx={{ mr: 1 }} /> Post
        </Button>
      </Box>
 
      {/*Back button to navigate to the Groups page*/}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            color: "#ffffff",
            borderColor: "#ffffff",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <Reply sx={{ mr: 1 }} /> Back
        </Button>
      </Box>
    </Box>
  );
};
export default DiscussionPage;
