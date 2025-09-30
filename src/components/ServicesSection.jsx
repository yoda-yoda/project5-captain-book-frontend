import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import Cookies from 'js-cookie';
import CalendarCreate from "../pages/CalendarCreate.jsx";
import CalendarUpdate from "../pages/CalendarUpdate.jsx"
import CalendarView from "../pages/CalendarView.jsx";
import CalendarItemView from "../pages/CalendarItemView.jsx";
import CalendarItemCreate from "../pages/CalendarItemCreate.jsx";
import CalendarItemUpdate from "../pages/CalendarItemUpdate.jsx";
import FetchError from "../pages/FetchError.jsx"
import SignUp from "../pages/SignUp.jsx";
import SignUpOk from "../pages/SignUpOk.jsx";
import SignIn from "../pages/SignIn.jsx";
import LoginModal from "./LoginModal.jsx";
import "../styles/ServicesSection.css"


function ServicesSection({ startBtnHandlerInRef, loginMainBtnHandlerInRef, fetchHandlerInRef }) {
  console.log("ServicesSection 호출됨", new Date().toISOString());

  const servicesSection = useRef(null);
  const loginModal = useRef(null);
  const loginModalInstance = useRef(null);
  const navigator = useNavigate();
  const location = useLocation();

  const [login, setLogin] = useRecoilState(loginAtom);
  const [catchFlag, setCatchFlag] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  const [errorResInstance, setErrorResInstance] = useState({
    status: 0,
    statusText: ""
  });


        console.log("logIn =>", login);

  // 오아스 구현 중
  const startBtnHandler = () => {
    console.log("login.isLogin: ", login.isLogin);

    if (login.isLogin) {


      if (servicesSection.current.style.display === 'none') {
        servicesSection.current.style.display = 'block';
      }

      navigator(`/home`);

      // 자동 스크롤
      servicesSection.current.scrollIntoView({ behavior: 'smooth' });


    } else {

      if (servicesSection.current.style.display === 'none') {
        servicesSection.current.style.display = 'block';
      }


    }

  };


  const loginMainBtnHandler = () => {
    console.log("login.isLogin: ", login.isLogin);

    if (login.isLogin) {


      if (servicesSection.current.style.display === 'none') {
        servicesSection.current.style.display = 'block';
      }


    } else {

      if (servicesSection.current.style.display === 'none') {
        servicesSection.current.style.display = 'block';
      }


    }

  };



  // 트러블슈팅 65,66 해결로인해 이거 이제 필요없는듯.
  // const csrfFetchHandler = async () => {

  //   if (login.isLogin) {
  //     console.log("csrfFetchHandler 내부 실행됨");

  //     try {
  //       const res = await fetch("/api/auth/csrf-token", {
  //         method: "GET",
  //         credentials: "include"
  //       })
  //       if (!res.ok) {
  //         console.log("csrfFetchHandler !res.ok");
  //       }
  //     } catch (err) {
  //       console.error("csrfFetchHandler 에러 발생=>", err);
  //     }
  //   }

  //   else {

  //   }

  // };



  // oauth 구현중(250917 16:10~) 
  const loginFetchHandler = useCallback(async () => {

    console.log("loginFetchHandler 내부 실행됨");

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
      })
      if (res.ok) {

        // 나중에 스프링 엔드포인트 응답을 리팩토링하여 resBody에 원하는 데이터 설정 가능
        const resBody = await res.json();

        console.log("로그인 성공, resBody=>", resBody);

        // 서버 로그인 성공시 Recoil 상태값 logIn을 갱신
        setLogin({
          isLogin: true,
          user: {
            id: resBody?.data?.id,
            name: resBody?.data?.name,
            email: resBody?.data?.email,
            provider: resBody?.data?.provider,
          }
        });


      }

    } catch (error) {
      // 이 핸들러에서는 에러가 나더라도 표시하지 않는다. 왜냐하면 로그인 여부만 알면 되는 fetch 핸들러이고,
      // 오류는 실제 비지니스 로직에서 처리하기 때문이다. 
      console.error("loginFetchHandler 내부 에러 발생=>", error);
    }

  }, []);




  const fetchHandler = useCallback(async (apiPathname, httpMethod, requestData) => {

    console.log("fetchHandler 내부 실행됨");
    console.log("apiPathname: ", apiPathname);

    try {

      const token = Cookies.get('XSRF-TOKEN');
      console.log("token===", token)

      // GET fetch 일때 입장
      if (httpMethod === "GET") {

        console.log("GET fetch 입장")

        if (requestData) {
          apiPathname = `${apiPathname}?userId=${encodeURIComponent(requestData)}`;
        }

        const res = await fetch(apiPathname,
          {
            credentials: "include"
          });

        if (!res.ok) {
          throw res;
        }

        const resJson = await res.json();
        console.log("GET fetch set 완료")
        return resJson;
      }

      // POST, PUT fetch 인 경우 전부 입장
      else if (httpMethod === "POST" || httpMethod === "PUT") {
        console.log("POST 또는 PUT 입장")

        const formLoginApi = "/api/formLogin";

        // POST, PUT 요청 중에서 formLoginApi 일때 입장 (현재 큰 차이는 Content-Type 과 body 데이터 형식)
        if (apiPathname === formLoginApi) {

          const formData = new URLSearchParams();
          formData.append("userId", requestData?.userId);
          formData.append("password", requestData?.password);

          const res = await fetch(apiPathname, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'X-XSRF-TOKEN': token,
            },
            method: httpMethod,
            body: formData.toString(),
            credentials: "include"
          });

          if (!res.ok && res.status !== 401) {
            throw res;
          }

          const resJson = await res.json();
          console.log("POST, PUT fetch 완료")
          return resJson;



        } else { // POST, PUT 요청 중에서 formLoginApi가 아닌 경우 입장

          const res = await fetch(apiPathname, {
            headers: {
              'X-XSRF-TOKEN': token,
              'Content-Type': 'application/json'
            },
            method: httpMethod,
            body: requestData ? JSON.stringify(requestData) : undefined,
            credentials: "include"
          });

          if (!res.ok) {
            throw res;
          }

          const resJson = await res.json();
          console.log("POST, PUT fetch 완료")
          return resJson;

        }

      }

      // DELETE fetch 일때 입장
      else if (httpMethod === "DELETE") {
        console.log("DELETE fetch 입장")
        const res = await fetch(apiPathname, {
          headers: { 'X-XSRF-TOKEN': token },
          method: 'DELETE',
          credentials: "include"
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
          setCatchFlag(() => Date.now())
          return;
        }


      }

      // 네트워크, json()파싱 오류 등 일때(에러 객체가 Response 객체가 아닐때)
      else {
        console.error(`error(비 HTTP 오류): [${resObject}]`);
        setErrorResInstance(resObject);
      }


      // 에러가 발생했을때만 변경하는 상태값이다.
      // Date.now로 에러가 빠르게 연속 2번 발생했을때 [catchFlag] 인식이 안될경우를 방지한다.
      // 이것을 이용하면 useLayoutEffect 로 error 발생을 체크한뒤 "/home/error"로 보내는것이 가능하다.
      setCatchFlag(() => Date.now())

      console.log("catch 문의 끝")

      // 이렇게 catch 문에서 return 값이 따로 없으면 fetchHandler는 undefined를 resolve값으로 가지게 된다.
      return;
    }

    console.log("fetchHandler 내부 완전히 정상종료(fetch 응답 성공 일때) ");

  }, []);



  useLayoutEffect(() => {

    const listenMessageHandler = (event) => {
      if (event.origin !== "http://localhost:3000") return;

      if (event.data.type === "OAUTH_SUCCESS") {

        // 첫화면으로 새로고침. (팝업닫히고 구글로고나 웹 이미지등이 깨지는 문제발생해서 깔끔하게 새로고침으로 처리)
        window.location.replace("/");
      }
    };

    window.addEventListener("message", listenMessageHandler);



    // 팝업창의 조작을 위한 if문
    if (window.opener && !window.opener.closed) {
      console.log("if (window.opener && !window.opener.closed");
      // 부모가 있으면 닫기 전 통보
      window.opener.postMessage({ type: "OAUTH_SUCCESS" }, "http://localhost:3000");

      window.close();

    }



    return () => {

      window.removeEventListener("message", listenMessageHandler);
    }

  }, []);



  // outh 구현중(250917 16:10~)
  // 첫 앱 마운트시 useLayoutEffect로 로그인 상태를 체크한다.
  useLayoutEffect(() => {
    loginFetchHandler();
  }, []);


  useLayoutEffect(() => {
    fetchHandlerInRef.current = fetchHandler;
  }, []);


  useLayoutEffect(() => {
    startBtnHandlerInRef.current = () => {
      startBtnHandler();
    };

    loginMainBtnHandlerInRef.current = () => {
      loginMainBtnHandler();
    };

  }, [login]);



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
        <Route path="/sign-up" element={<SignUp servicesSection={servicesSection} fetchHandler={fetchHandler} />} />
        <Route path="/sign-up/ok" element={<SignUpOk servicesSection={servicesSection} />} />
        <Route path="/sign-in" element={<SignIn servicesSection={servicesSection} fetchHandler={fetchHandler} />} />
        <Route path="/home" element={<CalendarView navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/home/error" element={<FetchError navigator={navigator} errorResInstance={errorResInstance} loginModal={loginModal} setLogin={setLogin} loginModalInstance={loginModalInstance} />} />
        <Route path="/create" element={<CalendarCreate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/update/:calendarId" element={<CalendarUpdate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item" element={<CalendarItemView navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item/create" element={<CalendarItemCreate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="/calendar/:calendarId/item/:calendarItemId/update" element={<CalendarItemUpdate navigator={navigator} fetchHandler={fetchHandler} servicesSection={servicesSection} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoginModal loginModal={loginModal} loginModalInstance={loginModalInstance} servicesSection={servicesSection} />


    </section>
    // <!-- /Services Section -->


  )




}

export default ServicesSection;