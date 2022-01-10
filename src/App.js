import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar';
import { AuthProvider } from './context/auth';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
