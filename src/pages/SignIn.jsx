import { useEffect, useState, } from "react";
import { useRecoilState } from 'recoil'
import { loginAtom } from '../recoil/atoms'
import "../styles/SignIn.css"

// 폼회원 로그인 페이지이다
function SignIn({ servicesSection, fetchHandler }) {

    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [login] = useRecoilState(loginAtom);


    const signInRequestData = {
        userId: userId,
        password: userPassword,
    }


    const signInSubmitBtnHandler = async (e) => {
        e.preventDefault();

        // 중복 제출 방지
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        const resJson = await fetchHandler("/api/formLogin", "POST", signInRequestData);

        // 현재 구현상 로그인에 성공하면 resJson에 200 객체가 할당되고,
        // 오류가 났을땐 401인 경우 resJson에 401 객체가 할당된다.
        // 왜냐하면 공용 fetchHandler 내부에서 폼로그인 api의 경우 그렇게 처리하도록 설정해놨기 때문이다
        // 이외의 오류는 자동으로 '/home/error'로 던져질것이며 resJson 변수 또한 undefined가 된다
        if (resJson?.statusCode === 200) {

            // 로그인에 성공하면 발급받은 액세스 토큰을 저장하고 홈화면으로 리다이렉트한다  
            const accessToken = resJson?.data?.accessToken;
            window.localStorage.setItem("accessToken", accessToken);

            window.location.href = "/";
        } else {
            // 따라서 401 미인증 상태에만 입장하도록 되어있다
            // 아이디 비밀번호 검증이 실패했음을 알린다

            setIsSubmitting(false);
            alert("아이디 또는 비밀번호를 다시 확인해주세요.");
        }



    }


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);



    // 로그인이 안된 상태(인증 fetch가 실패한 상태)에서만 폼로그인 컴포넌트가 보이도록 한다.
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


    else {
        // 로그인이 된 상태(인증 fetch가 성공한 상태)에서 입장하면 홈화면으로 리다이렉트 한다.
        window.location.replace("/");
        return null;
    }


}

export default SignIn;