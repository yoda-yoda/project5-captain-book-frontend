import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/CalendarItemCreate.css"
import Loading from "../components/Loading.jsx";

function CalendarItemCreate({ navigator, fetchHandler, servicesSection }) {

    const { calendarId } = useParams();
    const [itemTitle, setItemTitle] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [type, setType] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [calendarResponseDto, setCalendarResponseDto] = useState({
        id: 0,
        date: "1111-11-11",
        title: "title",
        totalAmount: 0
    });

    const createItemRequestData = {
        itemTitle: itemTitle,
        itemAmount: itemAmount,
        type: type
    }

    const itemSaveSubmitBtnHandler = async (e) => {
        e.preventDefault();

        // 중복 제출 방지
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        await fetchHandler(`/api/calendar/${calendarId}/item`, "POST", createItemRequestData);
        navigator(`/calendar/${calendarId}/item`);
    }

    async function checkFetchData() {
        const resCalendarDto = await fetchHandler(`/api/calendar/${calendarId}`, "GET");

        // 현재 구현상 error가 발생하면 resCalendarDto는 undefined 이다.
        if (resCalendarDto) {
            setCalendarResponseDto(resCalendarDto?.data);
            setLoaded(true);
        }
    }


    // 렌더링 진입시(뒤로가기 포함) 최신 데이터 갱신을 위한 useLayoutEffect의 fetch 로직이다.
    useLayoutEffect(() => {
        checkFetchData();
    }, []);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    console.log("calendarResponseDto", calendarResponseDto)


    if (calendarResponseDto && loaded) {
        return (

            <div className="container">
                <div className="row gy-4">

                    <div className="container calendar-item-create-contents">


                        {/* <!-- Start item top --> */}
                        <button onClick={() => navigator("/home")} className="home-btn-container">
                            <i className="bi bi-house-door-fill home-btn" />
                        </button>

                        <hr id="item-create-top-hr" className="top-hr"></hr>

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

                        <hr id="item-create-top-hr" className="top-hr"></hr>

                        {/* <!-- End item top --> */}



                        <div className="container calendar-item-create-inner-contents" data-aos="fade-in">


                            <form action="" onSubmit={(e) => { itemSaveSubmitBtnHandler(e) }}>
                                <div className="container item-create-data-flex-box">
                                    <div className="container item-create-data-flex-input-box">
                                        <div>
                                            <label htmlFor="item-create-title">
                                                <span className="item-create-title">항목:</span>
                                            </label>
                                            <input
                                                className="item-create-title-input"
                                                type="text" id="item-create-title" name="itemTitle" placeholder="항목명을 입력하세요"
                                                onChange={(e) => setItemTitle(e.target.value)}
                                                maxLength={45}
                                                required />
                                        </div>

                                        <div>
                                            <label htmlFor="item-create-amount">
                                                <span className="item-create-amount">금액:</span>
                                            </label>
                                            <input
                                                className="item-create-amount-input"
                                                type="number" id="item-create-amount" name="itemAmount" placeholder="금액을 입력하세요"
                                                onChange={(e) => setItemAmount(e.target.value)}
                                                required min="0" max="999999999999" />
                                        </div>
                                        <div>
                                            <span className="item-create-type">종류:</span>
                                            <label className="item-create-type-label-expense">
                                                <input type="radio" name="type" value="EXPENSE"
                                                    checked={type === "EXPENSE"}
                                                    onChange={(e) => setType(e.target.value)}
                                                    required />
                                                지출
                                            </label>
                                            <label className="item-create-type-label-income">
                                                <input type="radio" name="type" value="INCOME"
                                                    checked={type === "INCOME"}
                                                    onChange={(e) => setType(e.target.value)}
                                                />
                                                수입
                                            </label>

                                        </div>
                                    </div>
                                    <div>
                                        <button className="item-create-btn" type="submit">
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
            <div className="container calendar-item-create-contents">
                <Loading />
            </div>
        )
    } else {
        return (
            <div className="container calendar-item-create-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>
        );
    }

}

export default CalendarItemCreate;