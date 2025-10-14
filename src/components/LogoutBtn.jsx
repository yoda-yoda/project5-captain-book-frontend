import "../styles/LogoutBtn.css"


function LogoutBtn({ setLogin, fetchHandlerInRef }) {


    const defaultLoginAtomData = {
        isLogin: false,
        user: {
            id: null,
            email: null,
            name: null,
            picture: null
        }
    }


    return (
        <a id="logoutBtn"
            onClick={async () => {


                setLogin(defaultLoginAtomData);

                // fetchHandler가 실행될 때 localStorage의 accessToken이 헤더에 포함되도록 한다.
                const resJson = await fetchHandlerInRef.current("/api/auth/logout", "POST");

                // fetchHandler 내부에서 오류가 나더라도 내부 에러처리가 되어있으므로 다시 이곳으로 엔진이 도달할 것이다.
                // 따라서 로그아웃 fetch요청이 성공하든 실패하든 accessToken은 안전하게 제거될 것으로 예상된다.  
                window.localStorage.removeItem("accessToken");

                window.location.href = "/";

            }}
        >로그아웃</a>
    )

}

export default LogoutBtn;