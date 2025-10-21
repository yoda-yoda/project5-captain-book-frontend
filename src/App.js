import { useLayoutEffect, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import MainHeader from './components/MainHeader.jsx';
import MainFooter from './components/MainFooter.jsx';
import PreLoader from './components/PreLoader.jsx';
import ScrollTop from './components/ScrollTop.jsx';
import MainPage from './pages/MainPage.jsx';

// <!-- Vendor CSS Files -->
import './styles/swiper-bundle.min.css';
import './styles/glightbox.min.css';
import './styles/aos.css';

// <!-- Main CSS File -->
import './styles/main.css';

// <!-- Custom CSS File -->
import './styles/Loading.css'


function App() {

  // 콜백 레지스트리(handlerRef) 방식을 활용하기 위한 useRef 이다.
  // 이 방식을 이용하면 DOM을 직접 추출할 필요가 없고,
  // ref의 current값에 콜백 함수 자체를 담아 함수 참조를 형제 컴포넌트끼리도 공유할 수 있다.
  const loginMainBtnHandlerInRef = useRef(() => { });
  const fetchHandlerInRef = useRef(() => { });


  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.async = true;
    document.body.appendChild(script);

    // 스크롤을 수동으로 설정한다
    window.history.scrollRestoration = 'manual';



    return () => {

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
