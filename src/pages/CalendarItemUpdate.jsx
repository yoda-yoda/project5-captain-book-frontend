import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../styles/CalendarItemUpdate.css"

// 달력 속 아이템을 수정하는 페이지이다 
function CalendarItemUpdate({ navigator, fetchHandler, servicesSection }) {

    const { calendarId } = useParams();
    const { calendarItemId } = useParams();
    const [itemTitle, setItemTitle] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [type, setType] = useState();
    const [loaded, setLoaded] = useState(false);

    // 아이템의 이름과 금액, 종류 input값을 담아 PUT 요청 하기위한 객체이다.
    const updateRequestData = {
        itemTitle: itemTitle,
        itemAmount: itemAmount,
        type: type
    }

    // 달력 객체를 담는 상태값이다
    // 어떤 달력인지를 표시하기 위함이다
    const [calendarResponseDto, setCalendarResponseDto] = useState({
        id: 0,
        date: "1111-11-11",
        title: "title",
        totalAmount: 0
    });

    // 아이템 객체를 담는 상태값이다
    // 어떤 아이템인지를 표시하기 위함이다
    const [calendarItemResponseDto, setCalendarItemResponseDto] = useState({
        id: 0,
        itemTitle: "title",
        itemAmount: 0,
        itemType: "지출",
        createdAt: "2000-01-01T00:00:00.000000",
        updatedAt: "2000-01-01T00:00:00.000000",
    });


    // 목적: 달력의 최신 상태와 아이템의 최신 상태를 받아오기위한 fetch 요청 핸들러이다
    async function checkFetchData() {

        const resCalendarDto = await fetchHandler(`/api/calendar/${calendarId}`, "GET");


        // 현재 구현상, error가 발생하면 resCalendarDto는 undefined 이다.
        // 공용 fetchHandler 내부에서 모든 에러가 처리되기 때문이다.
        // 따라서 상위 데이터인 달력이 없으면 굳이 하위 데이터인 아이템을 확인할 필요도 없이 바로 종료시킨다
        if (!resCalendarDto) return;

        // 해당 아이템의 개별 상태를 받아온다
        const resItemDto = await fetchHandler(`/api/calendar/${calendarId}/item/${calendarItemId}`, "GET");


        if (resCalendarDto && resItemDto) {
            // 현재 구현상, error가 발생하면 resItemDto는 undefined 이다.
            // 따라서 모든 요청이 성공적이라면 그때 데이터들을 상태값에 저장하고 loaded를 true로 만든다

            setCalendarResponseDto(resCalendarDto?.data);
            setCalendarItemResponseDto(resItemDto?.data);
            setLoaded(true);
        }
    }

    // 달력 아이템 수정 PUT 제출 핸들러이다
    const itemUpdateSubmitBtnHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/api/calendar/item/${calendarItemResponseDto.id}/update`, "PUT", updateRequestData);
        navigator(`/calendar/${calendarId}/item`);
    }


    // 첫 컴포넌트 진입시(뒤로가기 포함), 최신 데이터값 갱신을 위한 fetch 요청 로직이다.
    useLayoutEffect(() => {
        checkFetchData();
    }, []);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 현재 구현상 fetch 통신이 정상적으로 이뤄지고 달력이 존재하며 loaded가 true일때만 화면을 렌더링한다.
    // return 내부 속성에서 변수 접근시 만약의 경우 발생할 버그의 방어 코드이다.
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

                            <form action="" onSubmit={(e) => { itemUpdateSubmitBtnHandler(e) }}>
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
    } else if (!loaded) { // 그렇지않으면 로딩 스피너가 돌아간다.
        return (

            <div className="container calendar-item-update-contents">
                <Loading navigator={navigator} />
            </div>

        )
    } else { // 여기 도달할 가능성은 거의 없지만 만일을 대비한 장치다.
        return (
            <div> 데이터 접근에 문제가 발생하였습니다. </div>
        );
    }
}

export default CalendarItemUpdate;