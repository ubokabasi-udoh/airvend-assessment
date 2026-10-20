import { Route, Routes } from "react-router";
import SignInPage from "./pages/sign-in";
import HomePage from "./pages/home";
import DashboardLayout from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="sign-in" element={<SignInPage />} />
      <Route path="dashboard" element={<DashboardLayout />} />
    </Routes>
  );
}

export default App;
