import { useUser } from "../hooks/useUsers";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spin } from "antd";

export default function ProtectedRoute({ children }) {
  const user = useUser((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

   if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
