import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./utils/AdminRoute";
import JournalDetailPage from "./pages/JournalDetailPage";
import CreateJournalPage from "./pages/CreateJournalPage";
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/AdminUserPage";


function App() {
return(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } 
      />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        </ProtectedRoute>
      } 
      />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute>
          <CreateJournalPage />
        </ProtectedRoute>
      } 
      />  
      <Route path="/journal/:id" element={
        <ProtectedRoute>
            <JournalDetailPage />
        </ProtectedRoute>
      } 
      />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
)
  

}

export default App
