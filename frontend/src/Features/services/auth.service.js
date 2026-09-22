import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     let originalReq = error.config;

//     if (error.response.status === 401 && !originalReq.retry) {
//       originalReq.retry = true;

//       try {
//         await axiosInstance.get("/api/auth/get-accessToken");
//         return axiosInstance(originalReq);
//       } catch (error) {
//         window.location.href = "/";
//         return Promise.reject(error);
//       }
//     }
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest.retry &&
      originalRequest.url !== "/api/auth/me"
    ) {
      originalRequest.retry = true;

      try {
        await axiosInstance.get("/get-accessToken");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);


 export async function register({
   email,
   password,
   name,
 })

 {
   const res = await axiosInstance.post("/register", {
     email,
     password,
     name,
   });

   return res.data;
 }

 export async function login({ email, password }) {
   const res = await axiosInstance.post("/login", { email, password });
   return res.data;
 }


 export async function getMe() {
   const res = await axiosInstance.get("/me");
   return res.data;
 }


 export async function getAcessToken() {
   const res = await axiosInstance.get("/getAccessToken");
   return res.data;
 }
