import { Outlet,Navigate } from "react-router"
import { useSelector } from "react-redux"


const Public = () => {


  const { user,loading } = useSelector((store) => store.auth);

   if (loading) {
     return <div>Loading...</div>;
   }
  if (user) return <Navigate to="/home" replace={true} />;

  return <Outlet />;
}

export default Public
