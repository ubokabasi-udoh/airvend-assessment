import { Navigate } from "react-router";

export default function HomePage() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" />;
  } else return <Navigate to="sign-in" />;
}
