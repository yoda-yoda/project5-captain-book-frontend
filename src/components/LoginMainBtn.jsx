import "../styles/LoginMainBtn.css"

function LoginMainBtn({ login, loginMainBtnHandlerInRef }) {

    const modalOption = login.isLogin
        ? {}
        : { "data-bs-toggle": "modal", "data-bs-target": "#loginModal" };

    return (

        <a id="mainLoginBtn"
            {...modalOption}
            onClick={() => loginMainBtnHandlerInRef.current()}
        >로그인</a>
    )


}

export default LoginMainBtn;