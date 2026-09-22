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
    const authPaths = ["/login", "/register", "/me", "/getAccessToken"];
    const isAuthRequest = authPaths.includes(originalRequest?.url);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.retry &&
      !isAuthRequest
    ) {
      originalRequest.retry = true;

      try {
        await axiosInstance.get("/getAccessToken");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export async function register({ email, password, name }) {
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
