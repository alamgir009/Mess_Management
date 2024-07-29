// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Common/Header.jsx';
import { Login } from './components/Auth/Login.jsx';
import { Register } from './components/Auth/Register.jsx';
import { About } from './components/Home/About.jsx';
import { Home } from './components/Home/Home.jsx';
import { Food } from './components/Home/Food.jsx';
import { Footer } from './components/Common/Footer.jsx';
import { RequestOtp } from './components/Home/RequestOtp.jsx';
import { ResetPassword } from './components/Home/ResetPassword.jsx';
import { Dashboard } from './components/Dashboard/Dashboard.jsx';
import ErrorPage from './components/Common/ErrorPage.jsx';
import NotFoundPage from './components/Common/NotFoundPage.jsx';
import MainLayout from './components/Common/MainLayout.jsx';
import { useSelector } from 'react-redux';

function App() {
  const userLog = useSelector((state) => state.userLogs.userLog);

  return (
    <Router>
      <Routes>
        {userLog !== "login" ? (
          <>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/signin" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/food" element={<MainLayout><Food /></MainLayout>} />
            <Route path="/requestotp" element={<MainLayout><RequestOtp /></MainLayout>} />
            <Route path="/resetpassword" element={<MainLayout><ResetPassword /></MainLayout>} />
          </>
        ) : (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        <Route path="/error" element={<ErrorPage message="You are not authorized to access this page." />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
