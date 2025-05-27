import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import NodesIcon from "../assets/Nodes_icon.png";

function DashboardLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://nodes-blog-api-production.up.railway.app/adminauth/profile",
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not logged in");
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);

        setIsLoggedIn(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/adminauth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ credential: username, password }),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        const errorObj = JSON.parse(responseText);
        setError(errorObj);
        return;
      }

      navigate("/");
    } catch (error) {
      console.log(error);
      setError({ message: "Unexpected error" });
    }
  };

  async function guestLogin() {
    try {
      setIsValidating(true);
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/adminauth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            credential: "guest-user@gmail.com",
            password: "guestguest",
          }),
        }
      );

      if (!response.ok) {
        setIsValidating(false);
        const responseText = await response.text();
        const errorObj = JSON.parse(responseText);
        setError(errorObj);
        return;
      }
      setIsValidating(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setIsValidating(false);
      setError({ message: "Unexpected error" });
    }
  }

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden">
      {/* Background design elements */}
      {/* <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-gray-800 to-transparent opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-gray-800 to-transparent opacity-30 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
      </div> */}

      {/* Full width content container */}
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left panel with design (visible on md screens and up) */}
        <div className="hidden md:flex md:w-1/2 bg-gray-900 bg-opacity-50 items-center justify-center relative">
          <div className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-8 border-4 border-white rounded-full flex items-center justify-center">
              {/* <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg> */}
              <img src={NodesIcon} alt="" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Nodes Admin Dashboard
            </h2>
            <p className="text-gray-300 max-w-md">
              Manage posts easily and maintain a healthy community.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="w-16 h-1 bg-white rounded-full mx-1"></div>
              <div className="w-4 h-1 bg-gray-600 rounded-full mx-1"></div>
              <div className="w-4 h-1 bg-gray-600 rounded-full mx-1"></div>
            </div>
          </div>

          {/* Bottom branding */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Nodes Admin Dashboard
            </p>
          </div>
        </div>

        {/* Right panel with login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 md:py-0">
          <div className="w-full max-w-md">
            {/* Mobile logo - only visible on mobile */}
            <div className="block md:hidden text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-white rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
              <p className="text-gray-400">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 border-gray-700 rounded bg-gray-900"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-400"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-gray-400 hover:text-white transition"
                  >
                    Forgot password?
                  </a>
                </div>
              </div> */}

              <div className="mt-12">
                <button
                  disabled={isValidating}
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                >
                  Sign in
                </button>
              </div>
              <input type="text" name="onpanel" hidden value={true} />
            </form>

            {error && (
              <div className="mt-8 p-4 bg-gray-900 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{error.message}</p>
              </div>
            )}

            <button
              onClick={guestLogin}
              disabled={isValidating}
              className="w-full flex justify-center py-3 px-4 rounded-full border border-white shadow-sm text-sm font-medium text-white black hover:bg-white hover:text-black hover:border-black cursor-pointer focus:outline-none  gap-3  transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Login as a guest
            </button>
            {/* Mobile footer - only visible on mobile */}
            <div className="block md:hidden mt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Admin Dashboard. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLogin;
