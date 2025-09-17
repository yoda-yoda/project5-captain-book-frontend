import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../styles/CalendarItemUpdate.css"

function CalendarItemUpdate({ navigator, fetchHandler, servicesSection }) {

    const { calendarId } = useParams();
    const { calendarItemId } = useParams();
    const [itemTitle, setItemTitle] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [type, setType] = useState();
    const [loaded, setLoaded] = useState(false);


    const updateRequestData = {
        itemTitle: itemTitle,
        itemAmount: itemAmount,
        type: type
    }

    const [calendarResponseDto, setCalendarResponseDto] = useState({
        id: 0,
        date: "1111-11-11",
        title: "title",
        totalAmount: 0
    });

    const [calendarItemResponseDto, setCalendarItemResponseDto] = useState({
        id: 0,
        itemTitle: "title",
        itemAmount: 0,
        itemType: "지출",
        createdAt: "2000-01-01T00:00:00.000000",
        updatedAt: "2000-01-01T00:00:00.000000",
    });

  
    async function checkFetchData() {
        
        const resCalendarDto = await fetchHandler(`/api/calendar/${calendarId}`, "GET");
        
        // 현재 구현상 error가 발생하면 resCalendarDto는 undefined 이다.
        // 따라서 상위 데이터인 달력이 없으면 굳이 하위 데이터인 항목을 확인할 필요없이 바로 종료하도록 한다.
        if (!resCalendarDto) return;

        const resItemDto = await fetchHandler(`/api/calendar/${calendarId}/item/${calendarItemId}`, "GET");
                                                   
        // 현재 구현상 error가 발생하면 resItemDto는 undefined 이다.
        if (resCalendarDto && resItemDto) {
            setCalendarResponseDto(resCalendarDto?.data);
            setCalendarItemResponseDto(resItemDto?.data);
            setLoaded(true);
        }
    }

    const updateBtnClickHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/api/calendar/item/${calendarItemResponseDto.id}/update`, "PUT", updateRequestData);
        navigator(`/calendar/${calendarId}/item`);
    }


    // 렌더링 진입시(뒤로가기 포함) 최신 데이터 갱신을 위한 useLayoutEffect의 fetch 로직이다.
    useLayoutEffect(() => {
            checkFetchData();
        }, []);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


    if (calendarResponseDto && loaded) {
        return (

            <div className="container">
                <div className="row gy-4">

                    <div className="container calendar-item-update-contents">


                        {/* <!-- Start item top --> */}
                        <button onClick={() => navigator("/home")} className="home-btn-container">
                            <i className="bi bi-house-door-fill home-btn" />
                        </button>

                        <hr id="item-update-top-hr" className="top-hr"></hr>

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

                        <hr id="item-update-top-hr" className="top-hr"></hr>

                        {/* <!-- End item top --> */}



                        <div className="container calendar-item-update-inner-contents">

                            <form action="" onSubmit={(e) => { updateBtnClickHandler(e) }}>
                                <div className="container item-update-data-flex-box">
                                    <div className="container item-update-data-flex-input-box">
                                        <div>
                                            <label htmlFor="item-update-title">
                                                <span className="item-update-title">항목:</span>
                                            </label>
                                            <input
                                                className="item-update-title-input"
                                                type="text" id="item-update-title" name="itemTitle"
                                                placeholder={calendarItemResponseDto.itemTitle} required
                                                maxLength={45} onChange={(e) => { setItemTitle(e.target.value) }}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="item-update-amount">
                                                <span className="item-update-amount">금액:</span>
                                            </label>
                                            <input className="item-update-amount-input"
                                                type="number" id="item-update-amount" name="itemAmount"
                                                placeholder={calendarItemResponseDto.itemAmount} required min="0" max="999999999999"
                                                onChange={(e) => { setItemAmount(e.target.value) }}
                                            />
                                        </div>
                                        <div>
                                            <span className="item-update-type">종류:</span>
                                            <label className="item-update-type-label-expense">
                                                <input
                                                    type="radio" name="type" value="EXPENSE"
                                                    checked={type === "EXPENSE"}
                                                    onChange={(e) => { setType(e.target.value) }}
                                                    required />
                                                지출
                                            </label>
                                            <label className="item-update-type-label-income">
                                                <input type="radio" name="type" value="INCOME"
                                                    checked={type === "INCOME"}
                                                    onChange={(e) => { setType(e.target.value) }} />
                                                수입
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="item-update-btn" type="submit">
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>


                    </div>

                </div>
            </div>


        )
    } else if (!loaded) {
        return (

            <div className="container calendar-item-update-contents">
                <Loading />
            </div>

        )
    } else {
        return (
            <div> 데이터 접근에 문제가 발생하였습니다. </div>
        );
    }
}

export default CalendarItemUpdate;