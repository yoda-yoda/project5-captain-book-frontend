import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../styles/CalendarUpdate.css";


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

    const updateRequestData = {
        date: date,
        title: title
    }



    const maxDate = "9999-12-31";

    const updateBtnClickHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/api/calendar/update/${calendarId}`, "PUT", updateRequestData);
        navigator("/home");
    }


    async function checkFetchData() {
        const resDto = await fetchHandler(`/api/calendar/${calendarId}`, "GET");

        // 현재 구현상 error가 발생하면 resDto는 undefined 이다.
        if (resDto) {  
            setCalendarResponseDto(resDto?.data);
            setLoaded(true);
        }
    }

    // 렌더링 진입시(뒤로가기 포함) 최신 데이터 갱신을 위한 useLayoutEffect의 fetch 로직이다.
    useLayoutEffect(() => {
            checkFetchData();
        }, []);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);


    console.log("calendarResponseDto", calendarResponseDto)


    // calendarResponseDto 가 존재할때 jsx를 렌더링한다.
    // (내부 속성에 접근시 만약의 경우 발생할 undefined 에러의 방어 코드)
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
                            <form action="" onSubmit={(e) => { updateBtnClickHandler(e) }}>

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
    } else if (!loaded) {
        return (


            <div className="container calendar-update-contents">
                <Loading />
            </div>


        )
    } else {
        return (
            <div className="container calendar-update-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>)
    }


}

export default CalendarUpdate;
