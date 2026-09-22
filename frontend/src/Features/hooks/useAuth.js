import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.service"
import { addUser,setLoading } from "../state/auth.slice";
import {useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";



export const useAuth = () => {



  const { register: formRegister, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()


  const dispatch = useDispatch()

  async function handleRegister({ email, password, name }) {

    try {

      const res = await register({ email, password, name })
      dispatch(addUser(res.user))
      dispatch(setLoading(false))
      return res.user

    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

   async function handleLogin({ email, password }) {

    try {
      const res = await login({ email, password })
      dispatch(addUser(res.user))
      dispatch(setLoading(false))
      navigate("/home")
      console.log("User data fetched successfully:", res.user);
      return res.user
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  async function handleGetMe() {
    try {
      const res = await getMe()
      dispatch(addUser(res.user))
      navigate("/home")
      console.log("User data fetched successfully:", res.user);
      return res.user
    } catch (error) {
      console.error("Error during fetching user data:", error);
    }

  }

  return {
    // Return the necessary values

    handleRegister,
    handleLogin,
    handleGetMe,
    register: formRegister,
    handleSubmit,
    errors,
    navigate
  };
}
