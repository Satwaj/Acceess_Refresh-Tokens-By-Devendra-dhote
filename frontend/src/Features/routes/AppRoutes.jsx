import { createBrowserRouter, RouterProvider } from "react-router"
import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import Login from "../Auth/components/Pages/Login"
import Register from "../Auth/components/Pages/Register"
import Home from "../components/Pages/Home"
import Public from "./protected/Public"
import Protected from "./protected/Protected"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { addUser, removeUser, setLoading } from "../state/auth.slice"
import { getMe } from "../services/auth.service"


const AppRoutes = () => {

  const dispatch = useDispatch()

useEffect(() => {
  const checkUser = async () => {
    try {
      dispatch(setLoading());

      const user = await getMe();
      console.log("User data fetched successfully:", user);
      dispatch(addUser(user));
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch(removeUser());
    }
  };

  checkUser();
}, []);

  let router = createBrowserRouter([
    {
      path: "/",
      element: <Public />,   //user aaya to /home pe redirect karna hai
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            {
              path: "",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
          ],
        },
      ],
    },
    {
      path: "/home",
      element: <Protected />,   //user nahi aaya to / pe redirect karna hai
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            {
              path: "",
              element: <Home />,
            },
          ],
        },
      ],
    },
  ]);
  return  <RouterProvider router={router} />
}

export default AppRoutes
