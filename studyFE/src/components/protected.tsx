import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ()=>{

    let auth = localStorage.getItem("authorization")

    return auth ? <Outlet/> : <Navigate to="/login" />

}

export default PrivateRoute