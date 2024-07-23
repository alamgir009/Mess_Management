import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Common/Header.jsx'
import { Login } from './components/Auth/Login.jsx'
import { Register } from './components/Auth/Register.jsx'
import { About } from './components/Home/About.jsx'
import { Home } from './components/Home/Home.jsx'
import { Food } from './components/Home/Food.jsx'
import { Footer } from './components/Common/Footer.jsx'
import { RequestOtp } from './components/Home/RequestOtp.jsx'
import { ResetPassword } from './components/Home/ResetPassword.jsx'
import { Dashboard } from './components/Dashboard/Dashboard.jsx'

function App() {

  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/signin' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/food' element={<Food/>} />
          <Route path='/requestotp' element={<RequestOtp/>} />
          <Route path='/resetpassword' element={<ResetPassword/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
        <Footer/>
      </Router>

      
    </>
  )
}

export default App
