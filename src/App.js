import logo from './logo.svg';
// import './App.css';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

import { useLayoutEffect } from 'react';
import MainHeader from './components/MainHeader.jsx';
import MainPage from './pages/MainPage.jsx';
import MainFooter from './components/MainFooter.jsx';
import PreLoader from './components/PreLoader.jsx';
import ScrollTop from './components/ScrollTop.jsx';
import ServicesSection from './components/ServicesSection.jsx'

// <!-- Vendor CSS Files -->
import './styles/aos.css';
import './styles/bootstrap.min.css';
import './styles/glightbox.min.css';
import './styles/swiper-bundle.min.css';
import './styles/ServicesSection.css'
// import './styles/bootstrap-icons.css';

// <!-- Main CSS File -->
import './styles/main.css';



function App() {

  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });

  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.src = './js/main.js';
    script.async = true;
    document.body.appendChild(script);
    window.history.pushState(null, '', '/');

  }, []);


  return (
    <>
      <MainHeader />
      <MainPage />
      <MainFooter />
      <ScrollTop />
      <PreLoader />
    </>

    )};

export default App;
