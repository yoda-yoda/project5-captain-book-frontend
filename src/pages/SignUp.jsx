import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import "../styles/SignUp.css"


function SignUp({ servicesSection, fetchHandler }) {

    const navigator = useNavigate();

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPasswordCheck, setUserPasswordCheck] = useState("");
    const [login, setLogin] = useRecoilState(loginAtom);


    const [invalidUserName, setInvalidUserName] = useState(false);
    const [invalidUserEmail, setInvalidUserEmail] = useState(false);
    const [invalidUserId, setInvalidUserId] = useState(false);
    const [idExists, setIdExists] = useState(false);
    const [invalidUserPassword, setInvalidUserPassword] = useState(false);
    const [invalidUserPasswordCheck, setInvalidUserPasswordCheck] = useState(false);


    const [errorResInstance, setErrorResInstance] = useState({
        status: 0,
        statusText: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const userNameRegExp = /^[가-힣a-zA-Z0-9]{2,20}$/;
    const userEmailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const userIdRegExp = /^[a-z][a-z0-9_]{4,19}$/;
    const userPasswordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,20}$/;


    const createRequestData = {
        name: userName,
        email: userEmail,
        userId: userId,
        password: userPassword,
    }



    const checkUserName = () => {

        if (!userNameRegExp.test(userName)) {
            setInvalidUserName(true);
        } else {
            setInvalidUserName(false);
        }
    }


    const checkUserEmail = () => {

        if (!userEmail) {
            setInvalidUserEmail(false);
            return;
        }


        if (!userEmailRegExp.test(userEmail)) {
            setInvalidUserEmail(true);
        } else {
            setInvalidUserEmail(false);
        }
    }



    const checkUserId = async () => {

        if (!userIdRegExp.test(userId)) {
            setIdExists(false);
            setInvalidUserId(true);
        } else if (await checkIdExists()) {
            setIdExists(true);
            setInvalidUserId(false);
        } else {
            setIdExists(false);
            setInvalidUserId(false);
        }
    }




    const checkIdExists = async () => {

        const token = Cookies.get('XSRF-TOKEN');
        console.log("token===", token)

        const resJson = await fetchHandler("/api/members/exits", "GET", userId);
        if (resJson?.data === true) {
            // 같은 아이디 존재
            return true;
        } else {
            return false;
        }

    }

    const checkUserPassword = () => {

        if (!userPasswordRegExp.test(userPassword)) {
            setInvalidUserPassword(true);
        } else {
            setInvalidUserPassword(false);
        }

        if (userPassword !== userPasswordCheck && userPasswordCheck !== "") {
            setInvalidUserPasswordCheck(true);
        } else {
            setInvalidUserPasswordCheck(false);
        }

    }

    const checkUserPasswordCheck = () => {

        if (userPasswordCheck !== userPassword) {
            setInvalidUserPasswordCheck(true);
        } else {
            setInvalidUserPasswordCheck(false);
        }
    }


    const allInputIsOk = () => {

        return (

            // 값이 전부 false 여야 유효한 입력값이며, 그때 true가 된다. 
            !(invalidUserName ||
                invalidUserEmail ||
                invalidUserId ||
                invalidUserPassword ||
                invalidUserPasswordCheck ||
                idExists)

            &&

            // 전부 빈값이 아니어야 유효한 입력값이며, 그때 true가 된다.
            (userName !== "" &&
                userId !== "" &&
                userPassword !== "" &&
                userPasswordCheck !== "")
        )

    }








    const saveSubmitBtnHandler = async (e) => {
        e.preventDefault();

        // 중복 제출 방지
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);


        if (allInputIsOk()) {
            await fetchHandler("/api/members", "POST", createRequestData);
            navigator(`/sign-up/ok`);

        } else {
            setIsSubmitting(false);
            alert("입력 내용을 다시 한번 확인해주세요.");
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

                    <div className="container sign-up-contents">


                        {/* <!-- Start item top --> */}
                        <button onClick={() => { window.scrollTo(0, 0); }} className="top-scroll-btn-container">
                            <i className="bi bi-arrow-up-short top-scroll-btn" />
                        </button>
                        {/* <!-- End item top --> */}


                        <div className="sign-up-title-box">
                            <img id="sign-up-dae-jang-bu-logo" src="/img/DaeJangBu-logo.jpg" alt="" />
                        </div>

                        <div className="container sign-up-inner-contents" >
                            <div className="container sign-up-data-flex-box">
                                <form action="" onSubmit={(e) => { saveSubmitBtnHandler(e) }}>


                                    <div className="container create-user-info-input-box">

                                        <input
                                            className="create-user-name-input"
                                            type="text" id="user-name" name="user-name" placeholder="이름"
                                            maxLength={50}
                                            onChange={(e) => setUserName(e.target.value)}
                                            onBlur={() => { checkUserName() }}
                                            required />


                                        <input
                                            className="create-user-email-input"
                                            type="email" id="user-email" name="user-email" placeholder="[선택] example@example.com"
                                            maxLength={100}
                                            onChange={(e) => { setUserEmail(e.target.value) }}
                                            onBlur={() => { checkUserEmail() }}
                                        />

                                        {invalidUserName && <span className="invalid-input-span"> 이름: 2~20개의 완성형 글자입니다. 특수문자와 공백 등은 제외됩니다. </span>}
                                        {invalidUserEmail && <span className="invalid-input-span"> 이메일: 올바른 이메일 형식을 입력해주세요. </span>}

                                    </div>

                                    <div className="container create-user-id-input-box">
                                        <input
                                            className="create-user-id-input"
                                            type="text" id="user-id" name="user-id" placeholder="아이디"
                                            maxLength={100}
                                            onChange={(e) => setUserId(e.target.value)}
                                            onBlur={() => { checkUserId() }}
                                            required />


                                        <input
                                            className="create-user-password-input"
                                            type="password" id="user-password" name="user-password" placeholder="비밀번호"
                                            maxLength={255}
                                            onChange={(e) => setUserPassword(e.target.value)}
                                            onBlur={() => { checkUserPassword() }}
                                            required />

                                        <input
                                            className="create-user-password-check-input"
                                            type="password" id="user-password-check" name="user-password-check" placeholder="비밀번호 확인"
                                            maxLength={255}
                                            onChange={(e) => setUserPasswordCheck(e.target.value)}
                                            onBlur={() => { checkUserPasswordCheck() }}
                                            required />

                                        {invalidUserId &&
                                            <span className="invalid-input-span"> 아이디: 5~20글자, 영어 소문자, 숫자, 언더바('_')가 가능합니다. 첫 글자는 영어입니다. </span>}

                                        {idExists &&
                                            <span className="invalid-input-span"> 다른 아이디를 사용해주세요. </span>}


                                        {invalidUserPassword &&
                                            <span className="invalid-input-span"> 비밀번호: 7~20글자, 영문 최소 1개, 숫자 최소 1개를 포함합니다.</span>}

                                        {invalidUserPasswordCheck &&
                                            <span className="invalid-input-span"> 비밀번호가 일치하지 않습니다.</span>}



                                        <button id="btn-sign-up" type="submit"
                                            onClick={() => { }}
                                        > 가입요청 </button>

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

export default SignUp;