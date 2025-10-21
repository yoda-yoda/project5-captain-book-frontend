
import { useNavigate, } from "react-router-dom";
import { useRecoilState } from 'recoil'
import { loginAtom } from '../recoil/atoms'
import { useEffect, } from "react";
import "../styles/SignUpOk.css"


function SignUpOk({ servicesSection }) {

    const navigator = useNavigate();

    const [login] = useRecoilState(loginAtom);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);



    // 로그인이 안된 상태(인증 fetch가 실패한 상태)에서만 폼로그인 성공 컴포넌트가 보이도록 한다.
    if (!login?.isLogin) {
        return (

            <div className="container">
                <div className="row gy-4">
                    <div className="container sign-up-ok-contents">

                        {/* <!-- Start item top --> */}
                        <button onClick={() => { window.scrollTo(0, 0); }} className="top-scroll-btn-container">
                            <i className="bi bi-arrow-up-short top-scroll-btn" />
                        </button>
                        {/* <!-- End item top --> */}

                        <div className="container sign-up-ok-inner-contents" >
                            <div className="container sign-up-ok-data-flex-box">

                                <img id="dae-jang-bu-logo" src="/img/DaeJangBu-logo.jpg" alt="" />

                                <h2 className="sign-up-ok-title"> 회원가입이 완료되었습니다! </h2>

                                <div className="container btn-sign-up-ok">
                                    <button id="btn-sign-up-ok" type="button"
                                        onClick={() => { navigator(`/sign-in`); }}
                                    > 로그인 하기 </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    } else {
        // 로그인이 된 상태(인증 fetch가 성공한 상태)에서 접근하면 리다이렉트 한다.
        window.location.replace("/");
        return null;

    }
}


export default SignUpOk;