import "../styles/LoginMainBtn.css"

// 우측 상단의 메인 로그인 버튼이다
function LoginMainBtn({ loginMainBtnHandlerInRef }) {

    // 현재 modalOption 의 목적:
    // 필요하다면 나중에, 이 버튼을 클릭해도 모달창이 뜨지않게 만들기 위해 도움을 주는 변수를 두었다.
    // 즉 현재는 modalOption 변수의 내용이 그대로 로그인 버튼 DOM 속성에 추가되는 구조이지만,
    // 필요시 modalOption에 삼항연산자를 구현하면 변수에 담기는 값이 동적으로 바뀌고,
    // 그러면 속성값이 동적으로 바뀌게되며 이 버튼을 클릭해도 모달창이 뜨지않게 만들수도 있다.

    // 현재 loginMainBtnHandlerInRef 의 목적:
    // 콜백레지스트리 방식으로 servicesSection.jsx와 공유되는 useRef 이다.
    // 즉 필요하다면 나중에, 이 버튼을 눌렀을때 작동할 함수를 servicesSection.jsx에서 추가할 수 있다.
    // 즉 servicesSection.jsx의 loginMainBtnHandler 안에 내용을 작성하면 이 버튼과 자동으로 공유될것이다.  
   
    const modalOption = { "data-bs-toggle": "modal", "data-bs-target": "#loginModal" };

    return (
        <a id="mainLoginBtn"
            {...modalOption}
            onClick={() => loginMainBtnHandlerInRef.current()}
        >로그인</a>
    )
}

export default LoginMainBtn;