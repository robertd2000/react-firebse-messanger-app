import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { Register } from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
