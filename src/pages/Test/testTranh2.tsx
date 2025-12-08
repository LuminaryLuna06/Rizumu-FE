import axiosClient from "@rizumu/api/config/axiosClient";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import React from "react";

function testTranh2() {
  const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axiosClient.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { access_token } = response.data;

      if (!access_token) {
        throw new Error("No access token in response");
      }

      localStorage.setItem("access_token", access_token);
      return access_token;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.dispatchEvent(new CustomEvent("open-auth-modal"));

      throw error;
    }
  };
  const editAccessToken = () => {
    localStorage.setItem("access_token", "HelloWorld");
  };

  return (
    <div>
      <ResponsiveButton onClick={() => refreshAccessToken()}>
        Refresh
      </ResponsiveButton>
      <ResponsiveButton onClick={() => editAccessToken()}>
        Doi access token
      </ResponsiveButton>
    </div>
  );
}

export default testTranh2;
