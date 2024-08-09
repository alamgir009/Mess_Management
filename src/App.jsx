// App.js
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Login } from "./components/Auth/Login.jsx";
import { Register } from "./components/Auth/Register.jsx";
import { About } from "./components/Home/About.jsx";
import { Home } from "./components/Home/Home.jsx";
import { Food } from "./components/Home/Food.jsx";
import { RequestOtp } from "./components/Home/RequestOtp.jsx";
import { ResetPassword } from "./components/Home/ResetPassword.jsx";
import { Dashboard } from "./components/Dashboard/Dashboard.jsx";
import ErrorPage from "./components/Common/ErrorPage.jsx";
import NotFoundPage from "./components/Common/NotFoundPage.jsx";
import MainLayout from "./components/Common/MainLayout.jsx";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";
import Table from "./components/Dashboard/Table.jsx";
import Market from "./components/Dashboard/Market.jsx";
import Meal from "./components/Dashboard/Meal.jsx";
import Notification from "./components/Dashboard/Notification.jsx";
import Messages from "./components/Dashboard/Messages.jsx";
import Payments from "./components/Dashboard/Payments.jsx";
import Profiles from "./components/Dashboard/Profiles.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/signin"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />
        <Route
          path="/food"
          element={
            <MainLayout>
              <Food />
            </MainLayout>
          }
        />
        <Route
          path="/requestotp"
          element={
            <MainLayout>
              <RequestOtp />
            </MainLayout>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <MainLayout>
              <ResetPassword />
            </MainLayout>
          }
        />
        <Route
          path="/error"
          element={
            <ErrorPage message="You are not authorized to access this page." />
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Protected Route: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table"
          element={
            <ProtectedRoute>
              <Table />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          } />
        <Route
          path="/meal"
          element={
            <ProtectedRoute>
              <Meal />
            </ProtectedRoute>
          } />
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          } />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
