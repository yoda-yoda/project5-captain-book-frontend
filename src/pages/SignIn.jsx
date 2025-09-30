import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import Cookies from 'js-cookie';
import "../styles/SignIn.css"

function SignIn({ servicesSection, fetchHandler }) {

    const navigator = useNavigate();

    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [login, setLogin] = useRecoilState(loginAtom);

    const [errorResInstance, setErrorResInstance] = useState({
        status: 0,
        statusText: ""
    });


    const signInRequestData = {
        userId: userId,
        password: userPassword,
    }



    const signInSubmitBtnHandler = async (e) => {
        e.preventDefault();

        const resJson = await fetchHandler("/api/formLogin", "POST", signInRequestData);

        if (resJson?.statusCode === 200) {
            window.location.href = "/";
        } else {
            alert("아이디 또는 비밀번호를 다시 확인해주세요.");
        }



    }


    useEffect(() => {
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 로그인이 안된 상태(인증 fetch가 실패한 상태)에서만 회원가입 컴포넌트가 보이도록 한다.
    if (!login?.isLogin) {
        return (

            <div className="container">
                <div className="row gy-4">

                    <div className="container sign-in-contents">


                        {/* <!-- Start item top --> */}
                        <button onClick={() => { window.scrollTo(0, 0); }} className="top-scroll-btn-container">
                            <i className="bi bi-arrow-up-short top-scroll-btn" />
                        </button>
                        {/* <!-- End item top --> */}


                        <div className="sign-in-title-box">
                            <img id="sign-in-dae-jang-bu-logo" src="/img/DaeJangBu-logo.jpg" alt="" />
                        </div>


                        <div className="container sign-in-inner-contents" >
                            <div className="container sign-in-data-flex-box">


                                <form action="" onSubmit={(e) => { signInSubmitBtnHandler(e) }}>


                                    <div className="container sign-in-input-box">
                                        <input
                                            className="sign-in-user-id-input"
                                            type="text" id="user-id" name="user-id" placeholder="아이디"
                                            maxLength={100}
                                            onChange={(e) => setUserId(e.target.value)}

                                            required />


                                        <input
                                            className="sign-in-user-password-input"
                                            type="password" id="user-password" name="user-password" placeholder="비밀번호"
                                            maxLength={255}
                                            onChange={(e) => setUserPassword(e.target.value)}
                                            required />



                                        <button id="btn-sign-in" type="submit"
                                            onClick={() => { }}
                                        > 로그인 </button>

                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        )
    }


    // 로그인이 된 상태(인증 fetch가 성공한 상태)에서 접근하면 리다이렉트 한다.
    else {

        window.location.replace("/");
        return null;

    }


}

export default SignIn;