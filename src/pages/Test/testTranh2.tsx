import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import axios from "axios";

function testTranh2() {
  const refreshAccessToken = async (): Promise<string> => {
    try {
      fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      // axios.post(`${import.meta.env.VITE_DEV_API_URL}/auth/refresh`, {
      //   withCredentials: true,
      // });

      return "wtf";
    } catch (error) {
      throw error;
    }
  };
  const refreshAccessToken2 = async (): Promise<string> => {
    try {
      fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      // axios.post(`${import.meta.env.VITE_DEV_API_URL}/auth/refresh`, {
      //   withCredentials: true,
      // });

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
      <ResponsiveButton onClick={() => refreshAccessToken2()}>
        Refresh2
      </ResponsiveButton>
      <ResponsiveButton onClick={() => editAccessToken()}>
        Doi access token
      </ResponsiveButton>
    </div>
  );
}

export default testTranh2;
