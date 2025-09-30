
import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import "../styles/SignUpOk.css"


function SignUpOk({ servicesSection }) {


    const navigator = useNavigate();

    const [login, setLogin] = useRecoilState(loginAtom);


    useEffect(() => {
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


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

        window.location.replace("/");
        return null;

    }
}


export default SignUpOk;