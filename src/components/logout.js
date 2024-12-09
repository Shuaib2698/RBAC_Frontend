import { useEffect } from "react";
import axios from "axios";

export const Logout = () => {
  useEffect(() => {
    const performLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          console.log("No refresh token found. Clearing storage and redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        await axios.post(
          "http://localhost:8000/logout/",
          { refresh_token: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        console.log("Logout successful.");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
      } finally {
        // Ensure tokens are cleared regardless of API success/failure
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        axios.defaults.headers.common["Authorization"] = null; // Remove the authorization header
        window.location.href = "/login"; // Redirect to login
      }
    };

    performLogout();
  }, []);

  return <div>Logging out...</div>;
};
