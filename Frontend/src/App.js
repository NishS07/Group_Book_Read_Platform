//This file defines routes for different components in the application.
import { BrowserRouter as DefaultRouter, Routes, Route } from "react-router";

import LoginPage from "./Components/LoginPage";
import HomePage from "./Components/HomePage";
import SignUpPage from "./Components/SignUpPage";
import AdminHomePage from "./Components/AdminHomePage";
import ProtectedRoute from "./Components/ProtectedRoute";
import UnauthorizedPage from "./Components/UnauthorizedPage";
import BookSelectionPage from "./Components/BookSelectionPage";
import YourGroupsPage from "./Components/MemberGroupsPage";
import GroupPage from "./Components/GroupPage";
import DiscussionPage from "./Components/DiscussionPage";
import AdminBookPage from "./Components/AdminBookPage";
import AdminGroupPage from "./Components/AdminGroupPage";
import AdminChapterPage from "./Components/AdminChapterPage";
const App = ({Router = DefaultRouter}) => {
  return(
      <Router>
        <Routes>
          {/*Public Route*/}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/*Protected Routes for Member and Admin*/}
          <Route path="/home" element={<ProtectedRoute allowedRoles={["member"]}><HomePage /></ProtectedRoute>} />
          <Route path="/adminhomepage" element={<ProtectedRoute allowedRoles={["admin"]}><AdminHomePage /></ProtectedRoute>} />
          
          {/*Member Routes*/}
          <Route path="/book-selection" element={<BookSelectionPage />} />
          <Route path="/member-group-page" element={<YourGroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="/groups/:groupId/chapters/:chapterId/discussion" element={<DiscussionPage />} />

          {/*Admin Routes*/}
          <Route path="/admin/books" element={<AdminBookPage />} />
          <Route path="/admin/groups" element={<AdminGroupPage />} />
          <Route path="/admin/chapters" element={<AdminChapterPage />} />
        </Routes>
      </Router>
  );
};

export default App;
