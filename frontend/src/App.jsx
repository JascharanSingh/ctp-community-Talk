
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Registration from './Registration'
import Profile from './pages/Profile';
import './css/global.css';
import './css/auth.css';
import './css/home.css';
import './css/responsive.css';


function App() {
  // check user login or not
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  

  // when user login
  const handleLogin = (userData) => {
    console.log('Login attempt with:', userData)
    setIsAuthenticated(true)
  }

  // when user register new
  const handleRegistration = (userData) => {
    console.log('Registration with:', userData)
    setIsAuthenticated(true)
  }

  // when user click logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }
  

  // take users from localStorage or make default one
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { email: 'chawa@gmail.com', password: 'chawa123', fullName: 'Test User' }
    ];
  });

  // route start, show page based on login
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* if login ok, go home. if not, go login page */}
          <Route 
            path="/" 
            element={isAuthenticated ? 
              <Home onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          
          {/* if not login, show login. if already login, go home */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/" />
            } 
          />
          
          {/* if not login, show register. if already login, go home */}
          <Route 
            path="/register" 
            element={!isAuthenticated ? 
              <Registration onRegister={handleRegistration} /> : 
              <Navigate to="/" />
            } 
          />

<Route path="/profile" element={<Profile onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
