import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";


// Create a new Axios instance with base URL
const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {

  const navigate = useNavigate();
  const { signOutUser } = useAuth();

  // Request interceptor
  axiosSecure.interceptors.request.use(
    function (config) {
      // Attach token to the Authorization header
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      // Handle request error
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosSecure.interceptors.response.use(
    function (response) {
      return response; // Return the response if successful
    },
    async (error) => {
      // Safely handle errors with a check for error.response
      if (error.response) {
        const status = error.response.status;
        console.log(status);
        // Handle 401 and 403 errors
        if (status === 401 || status === 403) {
          try {
            await signOutUser();
            navigate("/signin");
          } catch (signOutError) {
            console.error("Error during sign-out:", signOutError);
          }
        }
      } else {
        // Handle cases where error.response is undefined (e.g., network errors)
        console.error("Network or server error:", error.message);
      }

      // Reject the error for further handling
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
