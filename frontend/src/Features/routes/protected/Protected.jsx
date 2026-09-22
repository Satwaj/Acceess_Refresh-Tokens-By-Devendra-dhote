import { useSelector } from "react-redux"
import {Outlet, Navigate} from "react-router"

const Protected = () => {

  const { user,loading } = useSelector((store) => store.auth)

  if (loading) {
     return <div>Loading...</div>;
   }

  if(!user) return <Navigate to="/" replace={true} />

  return <Outlet/>
}

export default Protected
