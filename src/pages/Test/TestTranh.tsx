import { useToast } from "@rizumu/utils/toast";
import React from "react";

function TestTranh() {
  const toast = useToast();
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() =>
          toast.success("Your data has been saved successfully!", "Hello")
        }
      >
        Show Success
      </button>
      <button
        onClick={() =>
          toast.error("Something went wrong. Please try again.", "Error")
        }
      >
        Show Error
      </button>
      <button
        onClick={() => toast.warning("You have unsaved changes!", "Warning")}
      >
        Show Warning
      </button>
      <button onClick={() => toast.info("A new version is available.", "Info")}>
        Show Info
      </button>
      <button onClick={() => toast.success("No title example")}>
        Success (No Title)
      </button>
    </div>
  );
}

export default TestTranh;
