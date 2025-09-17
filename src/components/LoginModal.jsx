import { useRef } from "react";

function LoginModal({loginModal}) {

    const googleLoginHandler = () => {
        const url = "http://localhost:8080/oauth2/authorization/google";

        // 팝업 창 옵션 설정 (너비, 높이 등)
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;


        window.open(url, 'googleLoginPopup',
            `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
        );
    }


    return (

        // bootstrap loginModal 
        <div ref={loginModal}
            className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="login-modal-body">

                        <div className="login-btn-container">

                            <h1 className="" id="loginModalLabel"> Account Login </h1>


                            <a className="kakao-login-btn" onClick={() => { }}>
                                <img id="kakao-login-logo" src="" alt="" />
                                <span id="kakao-login-btn-span">카카오로 시작하기</span>
                            </a>


                            <a className="naver-login-btn" onClick={() => { }}>
                                <img id="naver-login-logo" src="" alt="" />
                                <span id="naver-login-btn-span">네이버로 시작하기</span>
                            </a>

                            <a className="google-login-btn" onClick={() => googleLoginHandler()}>
                                <img id="google-login-logo" src="/img/google-logo.png" alt="" />
                                <span id="google-login-btn-span">구글로 시작하기</span>
                            </a>



                        </div>

                    </div>


                </div>
            </div>
        </div >

    )
}


export default LoginModal;