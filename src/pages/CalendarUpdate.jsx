import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { selectedCalendar } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import "../styles/CalendarUpdate.css";

function CalendarUpdate({ navigator, location, fetchHandler, servicesSection }) {


    const [date, setDate] = useState();
    const [title, setTitle] = useState();
    const [calendarResponseDto, setCalendarResponseDto] = useRecoilState(selectedCalendar);
    const { calendarId } = useParams();

    const updateRequestData = {
        date: date,
        title: title
    }

    

    const maxDate = "9999-12-31";

    const updateBtnClickHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/calendar/update/${calendarId}`, "PUT", updateRequestData);
        navigator("/home");
    }



    // 마운트때에만 state 값을 전역 recoil 상태값으로 설정하기위한 useLayoutEffect 이다.(해쉬 변경은 리렌더링이므로 무시)  
    // 현재 구조상 (location.state)가 존재할때는 2가지 경우다.
    // 첫째는 update 확인을 눌렀을때(navigator()로 state까지 전달됨),
    // 둘째는 뒤로가기, 앞으로가기 등으로 state가 있는 history 스택을 만났을때이다.
    useLayoutEffect(() => {
        console.log("location.state", location.state)
        if (location.state) {
            setCalendarResponseDto(location.state?.calendarResponseDtoVariable)
        }

    }, []);



    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);




    console.log("calendarResponseDto", calendarResponseDto)


    // calendarResponseDto 가 존재할때 jsx를 렌더링한다.
    // 만약 state값(calendarResponseDto값)이 없을때 발생할 오류에 대한 방어코드이다.
    // (내부 속성에 접근시 발생할 undefined 에러의 방어 코드)
    if (calendarResponseDto) {
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
                                max={maxDate}
                                required />
                        </div>

                        <div>
                            <label htmlFor="calendar-title">제목:</label>
                            <input type="text" id="calendar-title" name="title" placeholder={`${calendarResponseDto.title}`}
                                onChange={(e) => { setTitle(e.target.value) }}
                                maxLength={35}
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
    } else {
        return (
            <div className="container calendar-update-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>)
    }



}

export default CalendarUpdate;
