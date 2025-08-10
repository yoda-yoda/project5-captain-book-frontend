import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CalendarHome from "../pages/CalendarHome.jsx";
import { useLayoutEffect } from "react";

function ServicesSection({ startBtnHandlerInRef }) {

  console.log("ServicesSection 호출됨");

  const servicesSection = useRef(null);


  const navigator = useNavigate();
  const location = useLocation();

  const handleOnClick = async function (id) {
    navigator(`/calendar/${id}/item`);
    const url = location.pathname;
    await fetchHandler(url)
  };

  const [fetchData, setFetchData] = useState({
    calendarResponseDtoList: [],
    calendarTotalSum: 0
  });

  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);


  const fetchHandler = useCallback(async (url) => {

    console.log("fetchHandler 실행됨");
    console.log("url: ", url);

    try {
      const res = await fetch("http://localhost:8080/errorTest")
      if (!res.ok) {
        throw new Error(`[서버 오류] 상태 코드: ${res.status}, 메시지: ${res.statusText}`);
      }

      // 정상 처리 일때
      const resJson = await res.json()
      // 이때 혹시 resJson이 캡처안되는지 체크하기 
      setFetchData(resJson)
      // 테스트중=> 여기에 loaded = true로 바꾸는 로직을 넣어야함.
      setLoaded(true);
      setError(false);
    }
    catch (error) {
      console.error(`오류 발생: ${error}`);

      // 에러 발생시 로직 짜는중

      // 에러 url로 이동
      navigator(`/error`);
      // 테스트중=> 여기에 loaded = true로 바꾸는 로직을 넣어야함. 오류가 나도 로딩이 끝났다고 표시
      setLoaded(true);
      setError(true);
      return;
    }
    console.log("fetchHandler 정상종료");

  }, []);


  const startBtnHandler = useCallback(async () => {

    setLoaded(false);

    // visible = true로 실제 section DOM이 생기고, paint까지 되었을때만 작동(혹시 모르는 예방)
    if (visible && servicesSection.current) {

      // url변경함.
      navigator(`/home`);

      // 자동 스크롤
      servicesSection.current.scrollIntoView({ behavior: 'smooth' });


      await fetchHandler(window.location.pathname);

    }


  }, [visible]);



  useLayoutEffect(() => {

    if (visible) {
      startBtnHandlerInRef.current = startBtnHandler;
    } else {

      // 첫 로드시에만 시작 버튼의 핸들러를 할당
      startBtnHandlerInRef.current = () => {
        setVisible((visible) => !visible)

        // 더블클릭을 빠르게 한 경우 버그를 예방하기 위해 바로 빈 함수로 초기화
        startBtnHandlerInRef.current = () => { }

        // url변경함.
        navigator(`/home`);

        // 그냥여기서 한번에 fetch하자. 참고로 async나 awiat이 아닌걸 체크하기.
        fetchHandler(window.location.pathname);
      };
    }
  }, [visible]);



  useEffect(
    // 이 콜백을 useCallback으로 감싸는것도 고려하기. 맨처음에만 실행할건데 계속 렌더링되니까.
    () => {
    //  visible = true로 실제 section DOM이 생기고, paint까지 되었을때 자동 스크롤을 작동 
    if (visible && servicesSection.current) {
      servicesSection.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [visible]);



  if (visible) {
    return (

      // <!-- Services Section -->
      // 달력앱 전체는 이 섹션안에서 작동한다.

      <section ref={servicesSection} id="services" className="services section">

        <CalendarHome fetchData={fetchData} loaded={loaded} error={error} />

      </section>

      // <!-- /Services Section -->
    )

  } else if (!visible) {
    return (
      <></>
    )
  }



}

export default ServicesSection;