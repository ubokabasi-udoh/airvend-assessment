import { Route, Routes } from "react-router";
import SignInPage from "./pages/sign-in";
import HomePage from "./pages/home";
import DashboardLayout from "./pages/dashboard/layout";
import UsersPage from "./pages/dashboard/user-management";
import FundingHistoryPage from "./pages/dashboard/funding-history";
import USSDExtensionPage from "./pages/dashboard/ussd-extension";
import APIManagementPage from "./pages/dashboard/api-management";
import DashboardPage from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="sign-in" element={<SignInPage />} />

      <Route path="dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="funding" element={<FundingHistoryPage />} />
        <Route path="ussd" element={<USSDExtensionPage />} />
        <Route path="api" element={<APIManagementPage />} />
      </Route>
    </Routes>
  );
}

export default App;
