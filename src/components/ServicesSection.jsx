import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import CalendarCreate from "../pages/CalendarCreate.jsx";
import CalendarUpdate from "../pages/CalendarUpdate.jsx"
import CalendarView from "../pages/CalendarView.jsx";
import CalendarItemView from "../pages/CalendarItemView.jsx";
import CalendarItemCreate from "../pages/CalendarItemCreate.jsx";
import CalendarItemUpdate from "../pages/CalendarItemUpdate.jsx";
import FetchError from "../pages/FetchError.jsx"
import "../styles/ServicesSection.css"


function ServicesSection({ startBtnHandlerInRef }) {
  console.log("ServicesSection 호출됨", new Date().toISOString());

  const servicesSection = useRef(null);
  const navigator = useNavigate();
  const location = useLocation();

  const [catchFlag, setCatchFlag] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errorResInstance, setErrorResInstance] = useState({
    status: 0,
    statusText: ""
  });


  const startBtnHandler = useCallback(() => {

    if (servicesSection.current.style.display === 'none') {
      servicesSection.current.style.display = 'block';
    }

    navigator(`/home`);

    // 자동 스크롤
    servicesSection.current.scrollIntoView({ behavior: 'smooth' });

  }, []);



  const fetchHandler = useCallback(async (apiPathname, httpMethod, requestData) => {

    console.log("fetchHandler 내부 실행됨");
    console.log("apiPathname: ", apiPathname);

    try {
      // GET fetch 일때 입장
      if (httpMethod === "GET") {
        console.log("GET fetch 입장")
        const res = await fetch(apiPathname);

        if (!res.ok) {
          throw res;
        }

        const resJson = await res.json();
        console.log("GET fetch set 완료")
        return resJson;
      }

      // POST, PUT fetch 일때 입장
      else if ((httpMethod === "POST" || httpMethod === "PUT") && requestData) {
        console.log("POST 또는 PUT 입장")
        const res = await fetch(apiPathname, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: httpMethod,
          body: JSON.stringify(requestData)
        });
        console.log("POST 또는 PUT fetch 정상 완료")
        if (!res.ok) {
          throw res;
        }
        return;
      }

      // DELETE fetch 일때 입장
      else if (httpMethod === "DELETE") {
        console.log("DELETE fetch 입장")
        const res = await fetch(apiPathname, {
          method: 'DELETE',
        });
        const text = await res.text() //
        console.log("text", text) //
        console.log("DELETE fetch 정상 완료")
        if (!res.ok) {
          throw res;
        }
        return;
      }

    } catch (resObject) {
      console.log("catch 문 입장")

      // HTTP 오류일때(Response 객체가 할당됨)
      if (resObject instanceof Response) {
        console.error(`error(HTTP 오류): [${resObject.status}, ${resObject.statusText}]`);

        try {
          const errorJson = await resObject.json();
          const errorJsonObject = {
            type: "errorJson",
            data: errorJson
          };
          setErrorResInstance(errorJsonObject);

        } catch (errorJsonParsingError) {
          console.error(`error json 파싱 오류: [${errorJsonParsingError}]`);
          setErrorResInstance(resObject);
          setCatchFlag((catchFlag) => !catchFlag);
          return;
        }


      }

      // 네트워크, json()파싱 오류 등 일때(에러 객체가 Response 객체가 아닐때)
      else {
        console.error(`error(비 HTTP 오류): [${resObject}]`);
        setErrorResInstance(resObject);
      }


      // 에러가 발생했을때만 변경하는 상태값.
      // 이것을 이용하면 useLayoutEffect 로 error 발생을 체크한뒤 "/home/error"로 보내는것이 가능하다.
      setCatchFlag((catchFlag) => !catchFlag);

      console.log("catch 문의 끝")

      // 이렇게 catch 문에서 return 값이 따로 없으면 fetchHandler는 undefined를 resolve값으로 가지게 된다.
      return;
    }

    console.log("fetchHandler 내부 완전히 정상종료(fetch 응답 성공 일때) ");

  }, []);



  useLayoutEffect(() => {
    startBtnHandlerInRef.current = () => {
      startBtnHandler();
    };

  }, []);


  useLayoutEffect(() => {
    console.log("section에서 useLayoutEffect 실행")

    // 뒤로가기 시 path가 "/"로 나왔을때 section이 block 된 상태로 빈공간이 보이는것을 예방한다.
    if (servicesSection.current.style.display === 'block' &&
      window.location.pathname === "/") {

      servicesSection.current.style.display = 'none';
    }

    // path가 "/" 인 상태에서 앞으로 가기를 했을때 section이 다시 보이도록 한다.
    // 또한 새로고침, url 직접 접근 등에도 section이 보이도록 한다.
    else if (servicesSection.current.style.display === 'none' &&
      window.location.pathname !== "/") {

      servicesSection.current.style.display = 'block';
    }

  }, [location.key])


  // 이 useLayoutEffect는 [catchFlag] 의존성배열이(catch문 안에서만 set하는 값이)바뀔때만 작동한다.
  // mounted 상태값을 이용해 첫 앱시작인 경우에 /home/error로 이동하지 않도록한다.
  useLayoutEffect(() => {
    if (mounted && servicesSection.current.style.display === 'block') {
      navigator("/home/error");
    }
  }, [catchFlag])


  // 첫 앱시작 마운트되는 경우를 알기위한 상태값 mounted 갱신과, 자동스크롤을 위한 useEffect이다.
  useEffect(() => {

    if (!mounted) {
      setMounted(true);
    }

    if (window.location.pathname === "/home/error" &&
      servicesSection.current.style.display === 'block' &&
      !window.location.href.includes("#")) {

      servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location.key])



  return (

    // <!-- Services Section -->
    // 달력앱 전체는 이 섹션안에서 작동한다.
    <section ref={servicesSection} id="services" className="services section" style={{ display: "none" }}>

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/home" element={<CalendarView navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/home/error" element={<FetchError navigator={navigator} errorResInstance={errorResInstance} />} />
        <Route path="/create" element={<CalendarCreate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/update/:calendarId" element={<CalendarUpdate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item" element={<CalendarItemView navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item/create" element={<CalendarItemCreate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item/:calendarItemId/update" element={<CalendarItemUpdate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </section>
    // <!-- /Services Section -->
  )




}

export default ServicesSection;