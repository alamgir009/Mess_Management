import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Common/Header.jsx'
import { Login } from './components/Auth/Login.jsx'
import { Register } from './components/Auth/Register.jsx'
import { About } from './components/Home/About.jsx'
import { Home } from './components/Home/Home.jsx'
import { Food } from './components/Home/Food.jsx'
import { Footer } from './components/Common/Footer.jsx'

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
        </Routes>
        <Footer/>
      </Router>
    </>
  )
}

export default App
