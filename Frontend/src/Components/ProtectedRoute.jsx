// This component protects routes by allowing access only to authorized users.
import { Navigate } from "react-router";

const ProtectedRoute = ({children, allowedRoles}) => {
    //retrieving authentication token and user role
    const accessToken = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("role");

    //redirect to login page if no token
    if (!accessToken){
        return <Navigate to="/" replace />;
    }

    //if users role not in allowed roles, redirect to the unauthorized page
    if(allowedRoles && !allowedRoles.includes(userRole))
    {
        return <Navigate to="/unauthorized" replace />;
    }

    //if authorized render the requested component
    return children;
};
export default ProtectedRoute;