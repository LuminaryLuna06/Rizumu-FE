import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import axios from "axios";
import React from "react";

function testTranh2() {
  const refreshAccessToken = async (): Promise<string> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        }
      );

      return "wtf";
    } catch (error) {
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
