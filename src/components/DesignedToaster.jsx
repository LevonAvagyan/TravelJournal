import { Toaster } from "react-hot-toast";

const DesignedToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        success: {
          iconTheme: {
            primary: "#52c41a",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff4d4f",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default DesignedToaster;
