import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const Home = () => {
    const [message, setMessage] = useState("");

    // Fetch data from the /home/ endpoint
    const fetchHomeData = useCallback(async () => {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (!accessToken) {
            console.log("No access token found. Redirecting to login.");
            clearTokensAndRedirect();
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/home/", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response?.status === 401 && refreshToken) {
                console.log("Access token expired. Attempting to refresh token...");
                const newAccessToken = await attemptRefreshToken(refreshToken);

                if (newAccessToken) {
                    console.log("Retrying API call with new access token...");
                    try {
                        const retryResponse = await axios.get("http://localhost:8000/home/", {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        });
                        setMessage(retryResponse.data.message);
                    } catch (retryError) {
                        console.error("Retry failed:", retryError.response?.data || retryError.message);
                        clearTokensAndRedirect();
                    }
                } else {
                    console.error("Refresh token failed. Redirecting to login...");
                    clearTokensAndRedirect();
                }
            } else {
                console.error("API error:", error.response?.data || error.message);
                clearTokensAndRedirect();
            }
        }
    }, []);

    // Attempt to refresh the token
    const attemptRefreshToken = async (refreshToken) => {
        try {
            const response = await axios.post("http://localhost:8000/token/refresh/", {
                refresh: refreshToken,
            });

            const newAccessToken = response.data?.access;
            if (newAccessToken) {
                console.log("New access token acquired.");
                localStorage.setItem("access_token", newAccessToken);
                return newAccessToken;
            } else {
                console.error("No access token in refresh response.");
                return null;
            }
        } catch (error) {
            console.error("Failed to refresh token:", error.response?.data || error.message);
            return null;
        }
    };

    // Redirect to login page
    const redirectToLogin = () => {
        window.location.href = "/login";
    };

    // Clear tokens and redirect to login
    const clearTokensAndRedirect = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        redirectToLogin();
    };

    // Call the fetchHomeData on component mount
    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    return (
        <div className="form-signin mt-5 text-center">
            <h3>Hi {message}</h3>
        </div>
    );
};
