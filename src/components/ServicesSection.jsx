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

  const handleOnClick = async function (id) {
    // navigator(`/calendar/${id}/item`);
    // const url = location.pathname;
    // await fetchHandler(url)
  };


  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [errorResInstance, setErrorResInstance] = useState({
        status: 0,
        statusText:""
    });

  const [fetchData, setFetchData] = useState({
    calendarResponseDtoList: [],
    calendarTotalSum: 0
  });


  const fetchHandler = useCallback(async (url) => {

    console.log("fetchHandler 실행됨");
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
      // 테스트중=> 여기에 loaded = true로 바꾸는 로직을 넣어야함.
      setLoaded(true);
      setError(false);
    }
    catch (resObject) {
      console.log("catch 문 입장")
      console.error(`error: [${resObject.status}, ${resObject.statusText}]`);

      setLoaded(true);
      setError(true);
      setErrorResInstance(resObject);

      console.log("catch 문의 네비 실행 직후")
      return;
    }
    console.log("fetchHandler 정상종료");

  }, []);


  const startBtnHandler = useCallback(async () => {

    console.log("1. startBtnHandler 시작")

    // url변경함.
    navigator(`/home`);
    console.log("2. navi(/home) 직후");

    // 자동 스크롤
    servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    await fetchHandler(window.location.pathname);
    console.log("7. startBtnHandler 정상종료")

  }, []);



  useLayoutEffect(() => {
    console.log("useLayoutEffect 1 실행")

    if (window.location.pathname == "/home" && loaded) {
      setLoaded(false);
      setError(false);
    }

    console.log("useLayoutEffect 1 종료")
  }, [location.key])


  useLayoutEffect(() => {

    console.log("useLayoutEffect 2 실행")

    if (loaded === true && error === true ) {
      navigator('/home/error');
    }

    console.log("useLayoutEffect 2 종료")
  }, [error])



  useLayoutEffect(() => {

    if (servicesSection.current.style.display === 'block') {
      startBtnHandlerInRef.current = startBtnHandler;

      console.log("핸들러 갱신")

    } else {

      // 첫 로드시에만 시작 버튼의 핸들러를 할당
      startBtnHandlerInRef.current = () => {
        console.log("0. 첫 핸들러 시작")
        servicesSection.current.style.display = 'block';

        // 더블클릭을 빠르게 한 경우 버그를 예방하기 위해 바로 빈 함수로 초기화
        startBtnHandlerInRef.current = () => { }

        startBtnHandler();

      };
    } console.log("useLayoutEffect 종료")
  }, [servicesSection.current]);



  // useEffect(
  //   // 나중에 이 콜백을 useCallback으로 감싸는것도 고려하기. 맨처음에만 실행할건데 계속 렌더링되니까.
  //   () => {

  //     //  visible = true로 실제 section DOM이 생기고, paint까지 되었을때 자동 스크롤을 작동 



  //     console.log("useEffect 종료")
  //   }, [error]);




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