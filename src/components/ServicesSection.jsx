import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import CalendarHome from "../pages/CalendarHome.jsx";
import FetchError from "../pages/FetchError.jsx"
import CalendarCreate from "../pages/CalendarCreate.jsx";
import { useLayoutEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";


function ServicesSection({ startBtnHandlerInRef }) {
  console.log("ServicesSection 호출됨", new Date().toISOString());

  const servicesSection = useRef(null);
  const navigator = useNavigate();
  const location = useLocation();

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [catchFlag, setCatchFlag] = useState(false);
  const [errorResInstance, setErrorResInstance] = useState({
    status: 0,
    statusText: ""
  });

  const [fetchData, setFetchData] = useState({
    calendarResponseDtoList: [],
    calendarTotalSum: 0
  });


    const handleOnClick = async function (id) {
    // navigator(`/calendar/${id}/item`);
    // const url = location.pathname;
    // await fetchHandler(url)
  };



  const fetchHandler = useCallback(async (url) => {

    console.log("fetchHandler 내부 실행됨");
    console.log("url: ", url);


    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw res;
      }
      // 정상 처리 일때
      const resJson = await res.json()
      // 이때 혹시 resJson이 캡처안되는지 체크하기 
      setFetchData(resJson)
      setLoaded(true);
      setError(false);
    }
    catch (resObject) {
      console.log("catch 문 입장")
      console.error(`error: [${resObject.status}, ${resObject.statusText}]`);

      setLoaded(true);
      setError(true);
      setErrorResInstance(resObject);


      // 에러가 발생했을때만 변경하는 상태값.
      // 이것을 이용하면 useLayoutEffect 로 error 발생을 체크한뒤 "/home/error"로 보내는것이 가능하고,
      // path가 바뀌어서 useLayoutEffect의 [location.key]로 다시 체크될때 무한루프에 빠지지 않도록하는 구현이 가능하다. 
      setCatchFlag((catchFlag) => !catchFlag)

      console.log("catch 문의 네비 실행 직후")
      return;
    }
    console.log("fetchHandler 내부 완전히 정상종료(fetch 응답 성공 일때) ");

  }, []);



  useLayoutEffect(() => {
    startBtnHandlerInRef.current = () => {
      startBtnHandler();
    };

  }, []);


  // 재실행될때마다 fetch 대비해서 나중에 의존성 배열 등 성능 개선해보기
  useLayoutEffect(() => {
    if (servicesSection.current.style.display === 'block' &&
      window.location.pathname === "/home" && !loaded) {
      console.log("serviceSection 동기코드중 if (window.location.pathname === /home 실행")
      fetchHandler(window.location.pathname);
    } else if (servicesSection.current.style.display === 'block' &&
      window.location.pathname === "/home" && loaded) {
      setLoaded(false);
      setError(false);
      fetchHandler(window.location.pathname);
    }

  }, [location.key])



  // 이 useLayoutEffect는 [catchFlag] 의존성배열이(catch문 안에서만 set하는 값이)바뀔때만 작동한다.
  // 즉 navigator("/home/error")로 리렌더링이 발생되더라도 if문 체크는 위의 useLayoutEffect에서 체크되고,
  // 위의 함수 안에선 에러에 해당하는 if문이 없기때문에 무시되어 무한루프에 빠지지않도록 하였다. 
  useLayoutEffect(() => {
    if (loaded && error) {
      navigator("/home/error");
    }
  }, [catchFlag])




  const startBtnHandler = useCallback(() => {

    console.log("1. startBtnHandler 함수 시작")

    if (servicesSection.current.style.display === 'none') {
      servicesSection.current.style.display = 'block';
    }

    // url변경함.
    navigator(`/home`);
    console.log("2. navi(/home) 직후");

    // 자동 스크롤
    servicesSection.current.scrollIntoView({ behavior: 'smooth' });

  }, []);



  return (

    // <!-- Services Section -->
    // 달력앱 전체는 이 섹션안에서 작동한다.

    <section ref={servicesSection} id="services" className="services section" style={{ display: "none" }}>

      <Routes>
        <Route path="/home" element={<CalendarHome fetchData={fetchData} loaded={loaded} error={error} />} />
        <Route path="/home/error" element={<FetchError errorResInstance={errorResInstance} />} />
        <Route path="/create" element={<CalendarCreate />} />
      </Routes>

    </section>
    // <!-- /Services Section -->
  )




}

export default ServicesSection;