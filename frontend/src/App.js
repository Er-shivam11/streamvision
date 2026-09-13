import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import VideoUpload from './components/VideoUpload/VideoUpload';
import VideoList  from './components/VideoList/VideoList';
import './App.css'; 
import Header from './components/Header/Header'; 
import Login from './components/Login/Login'; 
import Sam from './components/Sam/Sam';  
import About from './components/About/About';  
import Home from './pages/Home/Home'; 
import Footer from './components/Footer/Footer';
import VideoDetail from './pages/VideoDetail/VideoDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header/>
        <Routes> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/VideoUpload" element={<VideoUpload />} /> 
          <Route path="/VideoList" element={<VideoList />} /> 
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/sam" element={<Sam />} />
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} /> {/* About page */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
