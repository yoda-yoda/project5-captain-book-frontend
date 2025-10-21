import { useNavigate } from "react-router-dom";
import { useEffect, } from "react";
import "../styles/LoginModal.css"

function LoginModal({ loginModal, loginModalInstance, servicesSection }) {

    const navigator = useNavigate();


    const googleLoginHandler = () => {
        const oauthLoginUrl = "https://localhost:8443/oauth2/authorization/google";

        // 팝업 창 옵션 설정 (너비, 높이 등)
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;


        window.open(oauthLoginUrl, 'googleLoginPopup',
            `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
        );
    }



    const formSignUpHandler = () => {

        loginModalInstance.current.hide();

        navigator("/sign-up");

        servicesSection.current.scrollIntoView({ behavior: 'smooth' });


    }


    const formLoginHandler = () => {

        loginModalInstance.current.hide();

        navigator("sign-in");

        servicesSection.current.scrollIntoView({ behavior: 'smooth' });


    }




    useEffect(() => {

        if (!loginModalInstance.current) {
            // 모달 인스턴스가 존재하지않으면 모달 DOM의 새 인스턴스를 생성

            loginModalInstance.current = new window.bootstrap.Modal(loginModal.current);
        }
    }, []);



    return (

        // bootstrap loginModal 
        <div ref={loginModal}
            className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" >
            <div className="modal-dialog loginModal">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="login-modal-body">

                        <div className="login-oauth-btn-container">

                            <img className="" id="loginModalLabel" src="/img/DaeJangBu-logo.jpg" />


                            <a className="kakao-login-btn" onClick={() => { alert("현재 준비중 입니다.\n구글 로그인을 이용해주세요.") }}>
                                <img id="kakao-login-logo" src="/img/kakao-logo.png" alt="" />
                                <span id="kakao-login-btn-span">카카오로 시작하기</span>
                            </a>


                            <a className="naver-login-btn" onClick={() => { alert("현재 준비중 입니다.\n구글 로그인을 이용해주세요.") }}>
                                <img id="naver-login-logo" src="/img/naver-logo.png" alt="" />
                                <span id="naver-login-btn-span">네이버로 시작하기</span>
                            </a>

                            <a className="google-login-btn" onClick={() => googleLoginHandler()}>
                                <img id="google-login-logo" src="/img/google-logo.png" alt="" />
                                <span id="google-login-btn-span">구글로 시작하기</span>
                            </a>

                        </div>

                        <div className="login-form-btn-container">

                            <a className="form-sign-up-btn" onClick={() => formSignUpHandler()}>
                                <img id="form-sign-up-logo" src="/img/DaeJangBu-radius-image-logo.png" alt="" />
                                <span id="form-sign-up-btn-span">직접 가입하기</span>
                            </a>

                            <a className="form-login-btn" onClick={() => formLoginHandler()}>
                                <img id="form-login-logo" src="/img/DaeJangBu-radius-image-logo.png" alt="" />
                                <span id="form-login-btn-span">직접 로그인하기</span>
                            </a>

                        </div>

                    </div>


                </div>
            </div>
        </div >

    )
}


export default LoginModal;