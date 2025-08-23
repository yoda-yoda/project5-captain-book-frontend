// import './App.css';
import { useLayoutEffect } from 'react';
import MainHeader from './components/MainHeader.jsx';
import MainPage from './pages/MainPage.jsx';
import MainFooter from './components/MainFooter.jsx';
import PreLoader from './components/PreLoader.jsx';
import ScrollTop from './components/ScrollTop.jsx';

// <!-- Vendor CSS Files -->
import './styles/aos.css';
import './styles/glightbox.min.css';
import './styles/swiper-bundle.min.css';
// import './styles/bootstrap-icons.css';

// <!-- Main CSS File -->
import './styles/main.css';

// <!-- Custom CSS File -->
import './styles/Loading.css'


function App() {

  console.log("App 실행")

  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });


  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.async = true;
    document.body.appendChild(script);
    window.history.scrollRestoration = 'manual';
  }, []);


  return (
    <>
      <MainHeader />
      <MainPage />
      <MainFooter />
      <ScrollTop />
      <PreLoader />
    </>

  )
};

export default App;
