import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useRecoilState } from 'recoil'
import { loginAtom } from '../recoil/atoms'
import CalendarItemCreate from "../pages/CalendarItemCreate.jsx";
import CalendarItemUpdate from "../pages/CalendarItemUpdate.jsx";
import CalendarItemView from "../pages/CalendarItemView.jsx";
import CalendarCreate from "../pages/CalendarCreate.jsx";
import CalendarUpdate from "../pages/CalendarUpdate.jsx"
import CalendarView from "../pages/CalendarView.jsx";
import FetchError from "../pages/FetchError.jsx"
import LoginModal from "./LoginModal.jsx";
import OAuthPoint from "./OAuthPoint.jsx";
import SignUpOk from "../pages/SignUpOk.jsx";
import SignUp from "../pages/SignUp.jsx";
import SignIn from "../pages/SignIn.jsx";
import "../styles/ServicesSection.css"


// 주된 서비스를 담당하는 컴포넌트다.
// 현재 구현상, 시작 버튼을 누르면 servicesSection DOM의 display가
// block 상태로 바뀌며 주 서비스가 화면에 나타나도록 하였다.
function ServicesSection({ startBtnHandlerInRef, loginMainBtnHandlerInRef, fetchHandlerInRef }) {

  const servicesSection = useRef(null);
  const loginModal = useRef(null);
  const loginModalInstance = useRef(null);
  const location = useLocation();
  const navigator = useNavigate();

  const [login, setLogin] = useRecoilState(loginAtom);
  const [catchFlag, setCatchFlag] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  const [errorResInstance, setErrorResInstance] = useState({
    status: 0,
    statusText: ""
  });


  // 목적: login.isLogin 상태값에 따라 servicesSection을 확실하게 화면에 보이게하며,
  // 달력 리스트를 요청하는 '나의 가계부 시작' 버튼의 핸들러이다.
  // 렌더링시 useRef에 담겨 MainPage.jsx밑 HeroSection.jsx밑 StartBtn.jsx와 공유한다.
  // 내부 if문의 클로저 현상은, 컴포넌트 밑쪽의 useLayoutEffect와 의존성배열을 이용해 항상 최신화 되도록하여 해결하였다.    
  const startBtnHandler = () => {

    if (login.isLogin) {

      if (servicesSection.current.style.display === 'none') {
        servicesSection.current.style.display = 'block';
      }
      navigator(`/home`);

      // servicesSection으로 자동 스크롤
      servicesSection.current.scrollIntoView({ behavior: 'smooth' });

    }
  };


  // 목적: 화면 우측 상단의 메인 '로그인' 버튼의 핸들러이다. 
  // 렌더링시 useRef에 담겨 App.js밑 MainHeader.jsx밑 LoginMainBtn.jsx와 함수를 공유한다.
  const loginMainBtnHandler = () => {
    // 현재는 필요하지않아서 비워뒀지만,
    // 나중에 onClick시 동작 로직이 필요시 이곳에 코드를 작성하면
    // 자동으로 LoginMainBtn.jsx와 공유될 것이다. 
  };


  // 목적: jwt 리프레시 토큰으로 토큰을 재발급 받으며
  // 인증 성공시 리액트 로그인 처리를 하는 로직의 핸들러다.
  // 이 핸들러를 호출하는 곳은 공용 fetch 핸들러인 fetchHandler이며, 401(인증 실패) 오류가 발생했을때 호출된다. 
  const refreshFetchHandler = useCallback(async () => {

    // 이 핸들러는 첫 액세스 토큰이 유효하지 않은 경우 호출된다.
    // 따라서 리프레시 토큰으로 액세스 토큰과 리프레시 토큰 모두를 재발급 시도한다.


    // 리액트 로그아웃 상태를 미리 선언하였다.
    // 이것을 recoil setLogin()에 담으면 로그아웃 처리가 된다.   
    const defaultLoginAtomData = {
      isLogin: false,
      user: {
        id: null,
        email: null,
        name: null,
        picture: null
      }
    }


    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include"
      });

      if (!refreshRes.ok) {
        // 리프레시 토큰 만료시 진입한다. 기존 액세스 토큰을 삭제 후 오류를 던지고,
        // catch에서 리프레시토큰 삭제(서버 로그아웃 처리)를 해야한다.

        window.localStorage.removeItem("accessToken");
        setLogin(defaultLoginAtomData);
        throw refreshRes;
      }


      // 이곳에 도달하면 refreshRes.ok 라는것이고
      // 새로운 액세스 토큰과 새로운 리프레시 토큰이 모두 발급된 것이다.
      const refreshResBody = await refreshRes.json();
      const newAccessTokenData = refreshResBody?.data?.accessToken;
      window.localStorage.setItem("accessToken", newAccessTokenData);

      const newAccessToken = window.localStorage.getItem("accessToken");


      if (!newAccessToken) {
        // 방금 발급받고 저장한 새 액세스 토큰이 비어있는 것이므로 부적절한 상황이다.
        // 기존 액세스 토큰을 삭제 후 오류를 던지고, catch에서 리프레시토큰 삭제(서버 로그아웃 처리)를 해야한다.

        window.localStorage.removeItem("accessToken");
        setLogin(defaultLoginAtomData);
        throw new Error('죄송합니다. 새로운 토큰 획득에 문제가 발생했습니다.');
      }


      // 새로운 액세스 토큰으로 2번째 인증 로직을 호출한다.
      const secondRes = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${newAccessToken}`,
        },
      });


      if (!secondRes.ok) {
        // 방금 정상적으로 발급받은 새 액세스 토큰의 인증 과정에 문제가 있는것이므로 부적절한 상황이다.
        // 기존 액세스 토큰을 삭제 후 오류를 던지고, catch에서 리프레시토큰 삭제(서버 로그아웃 처리)를 해야한다.

        window.localStorage.removeItem("accessToken");
        setLogin(defaultLoginAtomData);
        throw secondRes;
      }


      // 새로운 액세스 토큰으로 2번째 인증 로직까지 정상적으로 성공한 경우 도달하며
      // Recoil 전역 상태값 logIn을 갱신해 리액트를 로그인 상태로 설정한뒤 종료한다.
      const secondResBody = await secondRes.json();

      setLogin({
        isLogin: true,
        user: {
          id: secondResBody?.data?.id,
          name: secondResBody?.data?.name,
          email: secondResBody?.data?.email,
          provider: secondResBody?.data?.provider,
        }
      });


      return;
      // 현재까지 구현상 만약 일반적인 api를 요청하던 중에
      // 이 리프레시 토큰에 의한 재발급 로직이 성공적으로 끝나고 이렇게 return으로 종료된다면,
      // 진행중이던 기존 fetch 요청은 초기화되는 것이다. 그러면 사용자는 다시 클릭해야할 것이다.
      // 따라서 나중에 기존 요청을 재요청하는 로직을 구현해야한다.   



    } catch (errorObject) {
      // 위에서 오류가 발생했다면 그것을 이 catch에서 잡고, 호출자에게 던질 준비를 하는 로직이다.
      // 리프레시 토큰이 만료된 정상적인 케이스도 이곳에 포함된다.


      // 2가지 속성을 가진 래퍼 객체를 totalErrorObject를 만들었다. 
      // 그 이유는, 위쪽에서 잡은 에러 객체도 잡고싶고,
      // 이 아래에 있는 서버 로그아웃 요청에서도 혹시나 잡힐 에러 또한 동시에 내보내고싶어서였다.
      const totalErrorObject = {
        firstErrorObject: null,
        secondErrorObject: null,
      };

      // 우선 첫번째 에러를 래퍼 객체에 담는다.
      totalErrorObject.firstErrorObject = errorObject;

      try {
        // 서버 로그아웃 요청으로, 리프레시 토큰을 서버와 브라우저에서 모두 제거한다.
        // 만약 이 과정에서조차 오류가 나면 이 오류도 래퍼 객체에 2번째 오류로 추가되어 호출자에게 던져진다.

        const logoutRes = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include"
        });

        if (!logoutRes.ok) {
          throw logoutRes;
        }

      } catch (secondErrorObject) {
        totalErrorObject.secondErrorObject = secondErrorObject;
        throw totalErrorObject;
      }

      // 여기 도달하면 위의 서버 로그아웃 요청은 정상적으로 끝난 것이므로
      // 첫번째 에러객체만 담긴 래퍼객체가 호출자에게 throw 된다.
      throw totalErrorObject;

    }


    // 현재 구현상, 이 모든 로직이 정상적으로 끝나면
    // 이 함수를 호출하는 곳은 undefined를 resolve값으로 갖는 promise객체가 반환된다.

  }, []);




  // 목적: 표면적인 인증이 목적인 핸들러이다.
  // 액세스 토큰을 이용해 서버에 인증 요청을 보내며 리액트 로그인 처리를 하고,
  // 유저의 정보를 담는 로직이다. 렌더링시 자동으로 실행되며
  // 내부에서는 공용 fetch 핸들러인 fetchHandler를 사용한다.
  const loginFetchHandler = useCallback(async () => {


    // 리액트 로그아웃 상태를 미리 선언하였다.
    // 이것을 recoil setLogin()에 담으면 로그아웃 처리가 된다.
    const defaultLoginAtomData = {
      isLogin: false,
      user: {
        id: null,
        email: null,
        name: null,
        picture: null
      }
    }

    const accessToken = window.localStorage.getItem("accessToken");

    if (!accessToken) {
      // 만약 액세스 토큰이 없다면 그냥 리액트를 확실히 로그아웃 상태로 설정만하고 종료한다.
      // 왜냐하면 이것은 첫방문 등 표면적인 인증이 목적인 핸들러이기 때문이다.
      setLogin(defaultLoginAtomData);
      return;
    }

    try {

      // 서버로 인증을 요청한다.
      const resJson = await fetchHandler("/api/auth/me", "GET");


      // 인증에 문제가 있다면 이 if문은 false여서 진입하지 못할것이다.
      // 왜냐하면 현재 모든 에러는 fetchHandler 내부에서 catch되어 통합 처리 되고 undefined를 반환하기 때문이다.
      if (resJson) {

        // 서버 로그인에 성공한 것이므로 Recoil 상태값 logIn을 갱신하고 리액트를 로그인 처리하며 종료한다.
        setLogin({
          isLogin: true,
          user: {
            id: resJson?.data?.id,
            name: resJson?.data?.name,
            email: resJson?.data?.email,
            provider: resJson?.data?.provider,
          }
        });
        return;
      }

    } catch (error) {

      // 현재 모든 에러는 fetchHandler 내부에서 catch되어 통합 처리 되기때문에
      // 이 catch문에 에러가 잡힐일은 거의 없다. 그러나 혹시라도 에러가 발생한다면 로그아웃 처리만하고 종료한다.
      console.error("loginFetchHandler 내부 에러 발생=>", error);
      setLogin(defaultLoginAtomData);
      return;
    }

  }, []);


  // 목적: 거의 모든 컴포넌트에서 fetch가 필요할때 props로 받아 공용으로 사용하는 fetch 핸들러이다.
  // 내부적으로 모든 에러 처리가 통합되어있고, 현재 에러가 나면 의존성배열 [catchFlag]가 변경되며
  // 그것은 useLayoutEffect에서 감지돼서 /home/error 로 라우팅되고 fetchError.jsx 컴포넌트가 렌더링된다.
  // 그 안에서 에러 화면 표시 등 모든 에러 처리가 이뤄진다.  
  const fetchHandler = useCallback(async (apiPathname, httpMethod, requestData) => {

    const accessToken = window.localStorage.getItem("accessToken");

    try {

      // GET인 경우 입장
      if (httpMethod === "GET") {

        if (requestData) {
          // signUp.jsx의 폼회원 가입 로직에서 id 중복 체크에 이용된다.
          apiPathname = `${apiPathname}?userId=${encodeURIComponent(requestData)}`;
        }

        const res = await fetch(apiPathname,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },

            credentials: "include"
          });


        if (!res.ok) {
          throw res;
        }

        const resJson = await res.json();
        return resJson;
      }

      // POST, PUT인 경우 전부 입장
      else if (httpMethod === "POST" || httpMethod === "PUT") {

        // SignIn.jsx에서 폼로그인시 사용하는 api 맵핑포인트이다.
        const formLoginApi = "/api/formLogin";


        if (apiPathname === formLoginApi) {
          // POST, PUT 요청 중에 폼로그인 일때 입장한다.
          // 현재 다른 POST, PUT 요청과의 큰 차이는 Content-Type 과 body데이터 형식과 401객체의 throw 여부다.

          const formData = new URLSearchParams();
          formData.append("userId", requestData?.userId);
          formData.append("password", requestData?.password);

          const res = await fetch(apiPathname, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            method: httpMethod,
            body: formData.toString(),
            credentials: "include"
          });

          if (!res.ok && res.status !== 401) {

            // 여기서 401인 경우를 throw 하지않는 이유는
            // 현재 구현상 폼로그인 에서의 401은 정상적인 경우이기 때문이다.
            throw res;
          }

          const resJson = await res.json();
          // 정상적인 데이터 뿐만아니라 401객체도 반환된다.
          return resJson;


        } else {
          // POST, PUT 요청 중에 폼로그인이 아닌 경우 입장한다.

          const res = await fetch(apiPathname, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            method: httpMethod,
            body: requestData ? JSON.stringify(requestData) : undefined,
            credentials: "include"
          });

          if (!res.ok) {
            throw res;
          }

          const resJson = await res.json();
          return resJson;

        }

      }

      // DELETE 일때 입장
      else if (httpMethod === "DELETE") {
        const res = await fetch(apiPathname, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          method: 'DELETE',
          credentials: "include"
        });

        const text = await res.text(); //

        if (!res.ok) {
          throw res;
        }
        return;
      }

    } catch (resObject) {
      // 위에서 잡힌 모든 에러가 이곳에 도달한다.

      if (resObject?.status === 401) {
        // 여기 잡힌 객체중에 401오류인 객체만 진입한다.
        // 참고로 여기 진입하면 대부분의 경우 resObject객체는 Response객체일 것이다.
        // 401 오류는 거의 Http 오류이기 때문이다. 


        try {
          await refreshFetchHandler();

          // 이 return에 도달한다는것은 위 refreshFetchHandler()가 정상적으로 처리되어
          // 새 토큰들이 성공적으로 발급된것이기 때문에 함수를 종료한다.
          return;

        } catch (totalErrorObject) {

          // 이 catch 로 진입했다는 것은 refreshFetchHandler 내부에서 오류가 발생한것이며,
          // 가장가능성 높은 시나리오는, 기존 액세스 토큰 만료 + 리프레시 토큰까지도 만료되어 재발급 인증까지 실패한것이다.
          // 또는 이외의 의도치않은 오류가 났을 수도 있다.

          // 현재 잡힌 totalErrorObject 라는 객체는 refreshFetchHandler 내부에서 던진 객체이며 2가지 속성을 가진 객체다.
          // 그러나 현재 이곳의 목적은, 개발 환경에서 나중에 개발자가 오류 로그를 쉽게 확인하기위한 catch 로직이며,
          // 중요한것은 로그아웃 처리와 재로그인 화면 확인이라고 생각하였다.
          // 그래서 이후 로직에 대한 코드는 현재 아무것도 적지않았고, 따라서 아래로 자연스럽게 흘러가도록 둔 상태이다.
          // 그렇게 되면 아래에서는 기존처럼 에러 객체를 1차 편집하고 setCatchFlag로 에러 상태 flag가 변하며
          // useLayoutEffect의 의존성배열로 인해 에러를 감지하고 '/home/error'로 라우팅되어 fetchError.jsx를 렌더링 하도록 되어있다.
          // 현재 그곳에는 전달되는 에러가 401일때 자동으로 로그인 모달창이 뜨도록 구현되어있다.

        }
      }


      if (resObject instanceof Response) {
        // HTTP 오류일때(에러 객체에는 Response 객체가 할당될것이다)
        // 로직은 에러 객체 포맷을 정제해 에러 객체를 저장하고, setCatchFlag로 에러 상태 flag를 변경하며
        // useLayoutEffect의 [catchFlag] 의존성배열로 해당 에러를 감지하게되고
        // 훅 내부에서 /home/error로 라우팅되어 fetchError.jsx는 에러 객체를 props로 받아 처리하여 렌더링되는 구조이다.

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


      else {
        // 네트워크, json()파싱 오류 등 일때(에러 객체가 Response 객체가 아닐때)
        // 로직은 에러 객체 포맷을 정제해 에러 객체를 저장하고, setCatchFlag로 에러 상태 flag를 변경하며
        // useLayoutEffect의 [catchFlag] 의존성배열로 해당 에러를 감지하게되고
        // 훅 내부에서 /home/error로 라우팅되어 fetchError.jsx는 에러 객체를 props로 받아 처리하여 렌더링되는 구조이다.

        console.error(`error(비 HTTP 오류): [${resObject}]`);
        setErrorResInstance(resObject);
      }



      // 401이 아닌 모든 에러와, 401 중에서도 refreshFetchHandler()에서 최종 인증이 실패한 경우도 전부 이곳에 도달한다.
      // catchFlag 상태를 Date.now()을 이용해 유일값으로 변경한다.
      // Date.now()를 활용하면 에러가 빠르게 연속 2번 발생했을때 [catchFlag] 인식이 안되는 경우를(예를들어 Strict 모드 등을)방지할 수 있다.
      // 이것을 이용하여 useLayoutEffect [catchFlag]로 error 발생을 체크한뒤 "/home/error"로 라우팅한다.
      setCatchFlag(() => Date.now())

      // 이렇게 catch 문에서 return 뒤의 값이 따로 없기때문에,
      // fetchHandler는 에러 발생시 항상 undefined를 resolve값으로 가진 promise 객체를 호출한 쪽으로 반환하게 된다.
      // 이런 특징을 호출한 곳의 if문 분기처리에서 활용가능하다.
      return;
    }


  }, []);




  // 목적: OAuth 팝업창 로그인을 위한 코드이다.
  // 팝업창에서 보내는 메시지를 감지하는 핸들러를 이벤트 리스너로 등록한다.
  useLayoutEffect(() => {

    const listenMessageHandler = (event) => {
      if (event.origin !== "https://localhost:3000") return;

      if (event.data.type === "OAUTH_SUCCESS") {

        const accessToken = event?.data?.accessToken;
        window.localStorage.setItem("accessToken", accessToken);

        // 첫화면으로 새로고침. (팝업닫히고 구글로고나 웹 이미지등이 깨지는 문제 대비해서 깔끔하게 새로고침으로 처리)
        window.location.replace("/");
      }
    };

    window.addEventListener("message", listenMessageHandler);

    // 재렌더링시 이벤트 리스너를 삭제해주는 클린업 코드이다.
    // 이벤트 리스너는 수동으로 삭제하지않으면 누적되어 메모리 누수로 성능 저하가 일어나기 때문이다.
    return () => {
      window.removeEventListener("message", listenMessageHandler);
    }

  }, []);



  // 목적: 처음 마운트시 loginFetchHandler()를 호출하며 표면적으로 로그인 상태를 체크한다.
  useLayoutEffect(() => {
    loginFetchHandler();
  }, []);


  // 목적: 처음 마운트시 콜백레지스트리 방식으로 공용 fetchHandler를 컴포넌트끼리 공유한다.
  useLayoutEffect(() => {
    fetchHandlerInRef.current = fetchHandler;
  }, []);


  // 목적: 처음 마운트시 콜백레지스트리 방식으로 startBtnHandler 와 loginMainBtnHandler 를 컴포넌트끼리 공유한다.
  // 공유하는 함수 내부에는 recoil 상태값 'login'을 참조하는데 이때 발생하는 클로저(closure) 현상은
  // 의존성배열 [login]를 추가하며 항상 최신 상태값 전달이 가능하도록 만들어 해결하였다.
  useLayoutEffect(() => {
    startBtnHandlerInRef.current = () => {
      startBtnHandler();
    };

    loginMainBtnHandlerInRef.current = () => {
      loginMainBtnHandler();
    };

  }, [login]);


  // 목적: 현재 구현상, 시작 버튼을 눌러야만 주 서비스 화면인 servicesSection DOM이
  // (display == none)에서 (display == block) 으로 바뀌면서 화면에 나타나도록 되어있으므로,
  // 앱이 처음 시작되는 경우(url이 '/' 일땐) servicesSection을 화면에서 숨겨지도록 만드는 훅이다.
  // 또한 반대로, url이 '/'이 아닌데 만약 none이라면 화면 표시를 위해 block으로 바꿔주는 훅이다.
  // 의존성배열 [location.key]를 이용해 뒤로가기, 앞으로가기 등에도 적용되도록 하였다. 
  useLayoutEffect(() => {

    // 만약 뒤로가기시 재렌더링이라 url이 "/"이더라도 block 상태일텐데,
    // 그때 또한 빈 공간이 안보이도록 만든다.
    if (servicesSection.current.style.display === 'block' &&
      window.location.pathname === "/") {

      servicesSection.current.style.display = 'none';
    }

    // 만약 path가 "/" 인 상태에서 앞으로 가기시 재렌더링이라 none 상태일텐데,
    // 그때 또한 servicesSection이 다시 보이도록 한다.
    // 또한 새로고침, url 직접 접근 등에도 servicesSection이 보이도록 한다.
    else if (servicesSection.current.style.display === 'none' &&
      window.location.pathname !== "/") {

      servicesSection.current.style.display = 'block';
    }

  }, [location.key])



  // 목적: 에러 처리를 통합해 하나의 에러 페이지로 다루기위한 훅이다.
  // 공용 fetchHandler에서 에러가 발생하면 에러객체를 상태값에 담은후 setCatch로 상태값이 바뀌게되는데,
  // 그때 이 훅은 [catchFlag]를 감지하며 '/home/error'로 라우팅해 fetchError.jsx 가 렌더링되고 그곳에서 통합적인 에러 표시가 이뤄진다.
  // mounted 상태값은, 앱이 첫 마운트이지만 servicesSection은 block인 경우 바로 '/home/error'로 이동하는것을 방지한다.
  useLayoutEffect(() => {
    if (mounted && servicesSection.current.style.display === 'block') {
      navigator("/home/error");
    }
  }, [catchFlag])


  // 목적: "첫 앱시작 마운트시 [catchFlag] 훅이 작동하지 않도록 도와주는 mounted 갱신과,
  // fetchError 컴포넌트가 렌더링됐을때 자동스크롤"을 해주기 위한 useEffect이다.
  // #이 없어야한다는 조건을 넣은이유는, 앵커 태그에 대한 브라우저 스크롤을 지켜주기 위해서다.
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
    <>
      {/* <!-- ServicesSection -->
          주 서비스는 이 ServicesSection 섹션안에서 작동한다. */}
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
          <Route path="/oauth/point" element={<OAuthPoint />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </section>
      {/* <!-- /Services Section --> */}

      <LoginModal loginModal={loginModal} loginModalInstance={loginModalInstance} servicesSection={servicesSection} />
    </>
  )


}

export default ServicesSection;