import { useLayoutEffect, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import MainHeader from './components/MainHeader.jsx';
import MainPage from './pages/MainPage.jsx';
import MainFooter from './components/MainFooter.jsx';
import PreLoader from './components/PreLoader.jsx';
import ScrollTop from './components/ScrollTop.jsx';

// <!-- Vendor CSS Files -->
import './styles/aos.css';
import './styles/glightbox.min.css';
import './styles/swiper-bundle.min.css';

// <!-- Main CSS File -->
import './styles/main.css';

// <!-- Custom CSS File -->
import './styles/Loading.css'


function App() {

  const loginMainBtnHandlerInRef = useRef(() => {});

  const fetchHandlerInRef = useRef(() => {});

  console.log("App 실행")

  // const loadScrollHandler = () => {
  //   window.scrollTo(0, 0);
  // }




  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.async = true;
    document.body.appendChild(script);
    window.history.scrollRestoration = 'manual';
    // window.addEventListener('load', loadScrollHandler);



    return () => {
      // window.removeEventListener('load', loadScrollHandler);
      
    }
  }, []);


  return (
    <>
      <RecoilRoot>
        <MainHeader loginMainBtnHandlerInRef={loginMainBtnHandlerInRef} fetchHandlerInRef={fetchHandlerInRef} />
        <MainPage loginMainBtnHandlerInRef={loginMainBtnHandlerInRef} fetchHandlerInRef={fetchHandlerInRef} />
        <MainFooter />
        <ScrollTop />
        <PreLoader />
      </RecoilRoot>
    </>

  )
};

export default App;
