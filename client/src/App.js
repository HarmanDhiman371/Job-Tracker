import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Companies from './pages/Companies';
import StudyProgress from './pages/Study';
import User from './components/User';
import Dashboard from './pages/DashBoard';
import ScrollToTop from './components/Scroll';
function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<Companies />} />
         <Route path="/study" element={<StudyProgress />} />
         <Route path="/user" element={<User />} />
          <Route path="/dashboard" element={<Dashboard />} />
       
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
