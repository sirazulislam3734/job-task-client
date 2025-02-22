import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthenticationPage = () => {
  const { user, setUser, signInGoogle, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state || "/";
  const handleLogin = async () => {
    try {
      const res = await signInGoogle();
      setUser(res.user);
      const userInfo = {
        name: res.user?.displayName,
        email: res.user?.email,
      };
      await axios.post("/users", userInfo)
      .then(res => {
        console.log(res);
      })
      Swal.fire({
        title: "success!",
        text: "Sign Up Successful!",
        icon: "success",
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Task Manager Login</h2>
        {user ? (
          <div>
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">{user.displayName}</h3>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthenticationPage;
