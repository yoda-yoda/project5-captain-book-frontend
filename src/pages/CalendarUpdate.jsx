import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../styles/CalendarUpdate.css";

// 달력을 수정하는 페이지이다
function CalendarUpdate({ navigator, fetchHandler, servicesSection }) {


    const [date, setDate] = useState();
    const [title, setTitle] = useState();
    const [loaded, setLoaded] = useState(false);
    const [calendarResponseDto, setCalendarResponseDto] = useState({
        id: 0,
        date: "1111-11-11",
        title: "",
        totalAmount: 0
    });
    const { calendarId } = useParams();


    // 달력의 날짜와 이름 input값을 담아 PUT 요청 하기위한 객체이다
    const updateRequestData = {
        date: date,
        title: title
    }

    // 달력 날짜의 최대허용값을 담은 변수이다
    const maxDate = "9999-12-31";


    // 달력 수정 PUT 제출 핸들러이다
    const updateSubmitBtnHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/api/calendar/update/${calendarId}`, "PUT", updateRequestData);
        navigator("/home");
    }

    // 반드시 달력이 존재해야 수정할 수 있으므로
    // 첫 마운트시, 최신 달력 상태를 서버로부터 받아오는 fetch 요청 핸들러이다
    async function checkFetchData() {
        const resDto = await fetchHandler(`/api/calendar/${calendarId}`, "GET");

        // 현재 구현상, error가 발생하면 resDto는 undefined 이다
        // 공용 fetchHandler 내부에서 모든 에러가 처리되기 때문이다
        if (resDto) {

            // 데이터가 존재하면 상태값에 저장하고 loaded를 true로 만들어 화면을 표시한다
            setCalendarResponseDto(resDto?.data);
            setLoaded(true);
        }
    }

    // 첫 컴포넌트 진입시(뒤로가기 포함), 최신 달력 상태 갱신을 위한 fetch 요청 로직이다
    useLayoutEffect(() => {
        checkFetchData();
    }, []);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 현재 구현상 fetch 통신이 정상적으로 이뤄지고 달력이 존재하며 loaded가 true일때만 화면을 렌더링한다
    // return 내부 속성에서 변수 접근시 만약의 경우 발생할 버그의 방어 코드이다
    if (calendarResponseDto && loaded) {
        return (

            <div className="container">
                <div className="row gy-4">

                    <div className="container calendar-update-contents">


                        {/* <!-- Start item top --> */}
                        <button onClick={() => navigator("/home")} className="home-btn-container">
                            <i className="bi bi-house-door-fill home-btn" />
                        </button>

                        <hr id="update-top-hr" className="top-hr"></hr>

                        <div className="container top-box">

                            <div className="container top-date">
                                <span className="top-calendar-date">달력</span>
                                <h3> {calendarResponseDto.date} </h3>
                            </div>

                            <div className="container top-title">
                                <span className="top-calendar-title">제목</span>
                                <h3> {calendarResponseDto.title}</h3>
                            </div>

                        </div>

                        <hr id="update-top-hr" className="top-hr"></hr>

                        {/* <!-- End item top --> */}



                        <div className="container calendar-update-inner-contents">
                            <form action="" onSubmit={(e) => { updateSubmitBtnHandler(e) }}>

                                <div className="container update-data-flex-box">
                                    <div className="container update-data-flex-input-box">
                                        <div>
                                            <label htmlFor="calendar-date">
                                                <span className="update-date">날짜:</span>
                                            </label>
                                            <input
                                                className="update-date-input"
                                                type="date" id="calendar-date" name="date" placeholder={`${calendarResponseDto.date}`}
                                                onChange={(e) => { setDate(e.target.value) }}
                                                max={maxDate}
                                                required />
                                        </div>

                                        <div>
                                            <label htmlFor="calendar-title">
                                                <span className="update-title">제목:</span>
                                            </label>
                                            <input
                                                className="update-title-input"
                                                type="text" id="calendar-title" name="title" placeholder={`${calendarResponseDto.title}`}
                                                onChange={(e) => { setTitle(e.target.value) }}
                                                maxLength={35}
                                                required />
                                        </div>
                                    </div>


                                    <button className="calendar-update-btn" type="submit">
                                        <i className="bi bi-check-lg"></i>
                                    </button>

                                </div>

                            </form>
                        </div>
                    </div>


                </div>
            </div>

        )
    } else if (!loaded) { // 그렇지않으면 로딩 스피너가 돌아간다
        return (
            <div className="container calendar-update-contents">
                <Loading navigator={navigator} />
            </div>


        )
    } else {  // 여기 도달할 가능성은 거의 없지만 만일을 대비한 장치다
        return (
            <div className="container calendar-update-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>)
    }


}

export default CalendarUpdate;
