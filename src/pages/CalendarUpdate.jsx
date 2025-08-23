import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/CalendarUpdate.css";

function CalendarUpdate({ navigator, location, fetchHandler, servicesSection }) {

    const [date, setDate] = useState();
    const [title, setTitle] = useState();
    const { calendarId } = useParams();
    console.log("calendarId", calendarId)

    const updateRequestData = {
        date: date,
        title: title
    }

    const calendarResponseDto = location.state.calendarResponseDtoVariable;

    const updateBtnClickHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/calendar/update/${calendarId}`, updateRequestData);
        navigator("/home");
    }


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);



    return (


        <>
            {/* <!-- Section Title --> */}
            <div className="container section-title" >
                <h2> 달력 </h2>
                <p>Let's gilit</p>
            </div>
            {/* <!-- End Section Title --> */}

            <div className="container calendar-update-contents">
                <h1> 달력 수정 페이지 </h1>

                <form action="" onSubmit={(e) => { updateBtnClickHandler(e) }}>
                    <div>
                        <label htmlFor="calendar-date">날짜:</label>
                        <input type="date" id="calendar-date" name="date" placeholder={`${calendarResponseDto.date}`}
                            onChange={(e) => { setDate(e.target.value) }}
                            required />
                    </div>

                    <div>
                        <label htmlFor="calendar-title">제목:</label>
                        <input type="text" id="calendar-title" name="title" placeholder={`${calendarResponseDto.title}`}
                            onChange={(e) => { setTitle(e.target.value) }}
                            required />
                    </div>

                    <div>
                        <button type="submit">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </>
    )



}

export default CalendarUpdate;
