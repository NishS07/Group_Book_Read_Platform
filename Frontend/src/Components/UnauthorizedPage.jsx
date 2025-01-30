//This component displays an error message when user tries to access a restricted page
const UnauthorizedPage = () => {
    return(
        <div style={{textAlign: "center", marginTop: "50px"}}>
            <h1>403 - Unauthorized</h1>
            <p>You do not have permission to access this page.</p>
        </div>
    );
};
export default UnauthorizedPage;