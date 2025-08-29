import { useCallback, useEffect, useRef, useState, useLayoutEffect, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CalendarCreate from "../pages/CalendarCreate.jsx";
import CalendarUpdate from "../pages/CalendarUpdate.jsx"
import CalendarHome from "../pages/CalendarHome.jsx";
import CalendarItemHome from "../pages/CalendarItemHome.jsx";
import CalendarItemCreate from "../pages/CalendarItemCreate.jsx";
import CalendarItemUpdate from "../pages/CalendarItemUpdate.jsx";
import FetchError from "../pages/FetchError.jsx"
import "../styles/ServicesSection.css"


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
    statusCode: 200,
    data: {}
  });


  // 동적 Route path의 패턴 체크를 위한 정규표현식List
  const regExpList = useMemo(() => {
    return {

      // Route path="/calendar/:calendarId/item" 형식 체크를 위한 정규표현식
      calendarItemViewRegExp: /^\/calendar\/\d+\/item$/,

    }
  }, [])



  const startBtnHandler = useCallback(() => {

    if (servicesSection.current.style.display === 'none') {
      servicesSection.current.style.display = 'block';
    }

    navigator(`/home`);

    // 자동 스크롤
    servicesSection.current.scrollIntoView({ behavior: 'smooth' });

  }, []);

  const navigatorToItems = (calendarId) => {
    navigator(`/calendar/${calendarId}/item`);
  };



  const fetchHandler = useCallback(async (pathname, httpMethod, requestData) => {

    console.log("fetchHandler 내부 실행됨");
    console.log("pathname: ", pathname);


    try {
      // GET fetch 일때 입장
      if (httpMethod === "GET") {
        console.log("GET fetch 입장")
        const res = await fetch(pathname);

        if (!res.ok) {
          throw res;
        }
        const resJson = await res.json();
        setFetchData(resJson)
        setLoaded(true);
        setError(false);
        console.log("GET fetch set 완료")
      }

      // POST, PUT fetch 일때 입장
      else if ((httpMethod === "POST" || httpMethod === "PUT") && requestData) {
        console.log("POST 또는 PUT 입장")
        const res = await fetch(pathname, {
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
      }

      // DELETE fetch 일때 입장
      else if (httpMethod === "DELETE") {
        console.log("DELETE fetch 입장")
        const res = await fetch(pathname, {
          method: 'DELETE',
        });
        const text = await res.text() //
        console.log("text", text) //
        console.log("DELETE fetch 정상 완료")
        if (!res.ok) {
          throw res;
        }

      }



    }

    catch (resObject) {
      console.log("catch 문 입장")

      setLoaded(true);
      setError(true);

      // HTTP 오류일때(Response 객체가 할당됨)
      if (resObject instanceof Response) {
        console.error(`error(HTTP 오류): [${resObject.status}, ${resObject.statusText}]`);
        setErrorResInstance(resObject);
      } else { // 네트워크, json()파싱 오류 등 일때(에러 객체가 Response 객체가 아닐때)
        console.error(`error(비 HTTP 오류): [${resObject}]`);
        setErrorResInstance(resObject);
      }

      // 에러가 발생했을때만 변경하는 상태값.
      // 이것을 이용하면 useLayoutEffect 로 error 발생을 체크한뒤 "/home/error"로 보내는것이 가능하고,
      // path가 바뀌어서 useLayoutEffect의 [location.key]로 다시 체크될때 무한루프에 빠지지 않도록하는 구현이 가능하다. 
      setCatchFlag((catchFlag) => !catchFlag)

      console.log("catch 문의 끝")
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
  // 문제는 없지만 가독성을 위해 나중에 if문 분기 없애고 하나로 통합해도될듯. 왜냐면 새로고침하면 어차피 display가 none인 경우라면 !loaded랑 loaded로 굳이 나눌 필요가 없는듯.
  // 나중에 로그인 기능넣었을때는 새로고침 시 block 유지 하도록 바꾼다면 이대로 둬야겠지만 일단 냅두기. 
  useLayoutEffect(() => {
    console.log("useLayoutEffect 실행")


    if (servicesSection.current.style.display === 'block' &&
      window.location.pathname === "/home" && !loaded &&
      !window.location.href.includes("#")) {

      fetchHandler(window.location.pathname, "GET");
      return;

    } else if (servicesSection.current.style.display === 'block' &&
      window.location.pathname === "/home" && loaded &&
      !window.location.href.includes("#")) {

      setLoaded(false);
      setError(false);
      fetchHandler(window.location.pathname, "GET");
      return;

    }


    // Route path="/calendar/:calendarId/item" 형식 일때 입장한다. 정규 표현식을 활용하였다.
    if (servicesSection.current.style.display === 'block' &&
      regExpList.calendarItemViewRegExp.test(window.location.pathname) && loaded &&
      !window.location.href.includes("#")) {

      setLoaded(false);
      setError(false);
      fetchHandler(window.location.pathname, "GET");
      return;
    }

  }, [location.key])



  // 이 useLayoutEffect는 [catchFlag] 의존성배열이(catch문 안에서만 set하는 값이)바뀔때만 작동한다.
  // 즉 navigator("/home/error")로 리렌더링이 발생되더라도 if문 체크는 위의 useLayoutEffect에서 체크되고,
  // 위의 함수 안에선 /home/error 에 해당하는 if문이 없기때문에 무시되어 무한루프에 빠지지않도록 하였다. 
  useLayoutEffect(() => {

    // 제일 초기 화면에 url을 루트(/) 로 유지하기 위한 방어 조건문(현재 구현상 가장 초기엔 display=none 이니까)
    if (servicesSection.current.style.display === 'block') {
      navigator("/home/error");
    }
  }, [catchFlag])


  // 자동스크롤을 위한 useEffect
  useEffect(() => {
    if (window.location.pathname === "/home" &&
      servicesSection.current.style.display === 'block' &&
      !window.location.href.includes("#")) {

      servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }
    else if (window.location.pathname === "/home/error" &&
      servicesSection.current.style.display === 'block' &&
      !window.location.href.includes("#")) {

      servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }
    else if (regExpList.calendarItemViewRegExp.test(window.location.pathname) &&
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
        <Route path="/home" element={<CalendarHome fetchData={fetchData} loaded={loaded} error={error} navigatorToItems={navigatorToItems} navigator={navigator} fetchHandler={fetchHandler} />} />
        <Route path="/home/error" element={<FetchError errorResInstance={errorResInstance} />} />
        <Route path="/create" element={<CalendarCreate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/update/:calendarId" element={<CalendarUpdate navigator={navigator} location={location} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item" element={<CalendarItemHome fetchData={fetchData} loaded={loaded} error={error} navigator={navigator} fetchHandler={fetchHandler} />} />
        <Route path="/calendar/:calendarId/item/create" element={<CalendarItemCreate navigator={navigator} location={location} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item/:calendarItemId/update" element={<CalendarItemUpdate navigator={navigator} location={location} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
      </Routes>

    </section>
    // <!-- /Services Section -->
  )




}

export default ServicesSection;