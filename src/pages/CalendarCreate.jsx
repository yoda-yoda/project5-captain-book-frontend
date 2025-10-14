import { useState, useEffect, useLayoutEffect } from "react";
import Loading from "../components/Loading.jsx";
import "../styles/CalendarCreate.css"

// 달력 생성 페이지이다.
function CalendarCreate({ navigator, fetchHandler, servicesSection }) {

    const [date, setDate] = useState();
    const [title, setTitle] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // 달력의 날짜와 제목의 input값을 담아 요청하기위한 객체이다.
    const createRequestData = {
        date: date,
        title: title
    }

    // 달력 날짜의 최대허용값을 담은 변수이다.  
    const maxDate = "9999-12-31"


    // 달력 저장 POST 제출 핸들러이다.
    const saveSubmitBtnHandler = async (e) => {
        e.preventDefault();

        // 중복 클릭 제출을 방지한다
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        await fetchHandler("/api/home", "POST", createRequestData);
        navigator("/home");
    }


    // 최신 인증 상태 갱신을 위한 가벼운 fetch 요청 핸들러이다.
    async function checkAuthFetchStatus() {
        const resAuthPingBody = await fetchHandler(`/api/auth/ping`, "GET");

        // 현재 구현상, error가 발생하면 resAuthPingBody는 undefined 이다.
        // 공용 fetchHandler 내부에서 모든 에러가 처리되기 때문이다. 
        if (resAuthPingBody?.statusCode === 200) {
            setLoaded(true);
        }

    }


    // 첫 컴포넌트 진입시(뒤로가기 포함), 최신 인증 상태 갱신을 위한 가벼운 fetch 요청 로직이다.
    useLayoutEffect(() => {
        checkAuthFetchStatus();
    }, []);



    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 현재 구현상 fetch 통신이 정상적으로 이뤄지면 loaded가 true이며 그때 화면을 렌더링한다.
    // 그렇지않으면 else이며 로딩 스피너가 돌아간다.
    if (loaded) {
        return (

            <div className="container">
                <div className="row gy-4">
                    <div className="container calendar-create-contents">


                        <button onClick={() => navigator("/home")} className="home-btn-container-calendar-create">
                            <i className="bi bi-house-door-fill home-btn" />
                        </button>


                        <hr id="create-top-hr" className="top-hr"></hr>

                        <div className="container top-box">

                            <h3 className="calendar-create-h3">달력 만들기</h3>

                        </div>

                        <hr id="create-top-hr" className="top-hr"></hr>



                        <div className="container calendar-create-inner-contents">
                            <form action="" onSubmit={(e) => { saveSubmitBtnHandler(e) }}>

                                <div className="container create-data-flex-box">
                                    <div className="container create-data-flex-input-box">
                                        <div>
                                            <label htmlFor="date">
                                                <span className="create-date">날짜:</span>
                                            </label>
                                            <input
                                                className="create-date-input"
                                                type="date" id="date" name="date"
                                                onChange={(e) => setDate(e.target.value)}
                                                max={maxDate}
                                                required />
                                        </div>

                                        <div>
                                            <label htmlFor="title">
                                                <span className="create-title">제목:</span>
                                            </label>
                                            <input
                                                className="create-title-input"
                                                type="text" id="title" name="title" placeholder="제목을 입력하세요"
                                                maxLength={35}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required />
                                        </div>
                                    </div>

                                    <button className="calendar-create-btn" type="submit">
                                        <i className="bi bi-check-lg"></i>
                                    </button>
                                </div>
                            </form>


                        </div>

                    </div>
                </div>
            </div>
        )
    } else {
        // (!loaded) 인 경우에 렌더링되며 로딩 스피너가 돌아간다.
        return (
            <div className="container calendar-item-create-contents">
                <Loading navigator={navigator} />
            </div>
        )
    }

}

export default CalendarCreate;