import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../styles/CalendarItemCreate.css"

// 달력 속 아이템 생성 페이지이다
function CalendarItemCreate({ navigator, fetchHandler, servicesSection }) {

    const { calendarId } = useParams();
    const [itemTitle, setItemTitle] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [type, setType] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // 달력 객체를 저장해놓을 상태값이다
    // 어떤 달력인지를 표시하기 위함이다
    const [calendarResponseDto, setCalendarResponseDto] = useState({
        id: 0,
        date: "1111-11-11",
        title: "title",
        totalAmount: 0
    });

    // 달력 아이템의 이름, 금액, 종류 input값을 담아 요청하기위한 객체이다.
    const createItemRequestData = {
        itemTitle: itemTitle,
        itemAmount: itemAmount,
        type: type
    }

    // 달력 아이템 저장 POST 제출 핸들러이다
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


    // 해당 컴포넌트는 상위 객체인 달력이 존재할때만 접근가능해야하므로
    // 첫 마운트시, url의 달력id를 활용해 최신 달력 상태를 서버로부터 받아오는 fetch 요청 핸들러이다.
    async function checkFetchData() {
        const resCalendarDto = await fetchHandler(`/api/calendar/${calendarId}`, "GET");

        // 현재 구현상, error가 발생하면 resCalendarDto는 undefined 이다.
        // 공용 fetchHandler 내부에서 모든 에러가 처리되기 때문이다. 
        if (resCalendarDto) {
            // 달력 데이터가 존재하면 상태값에 저장하고 loaded를 true로 만들어 화면을 표시한다.

            setCalendarResponseDto(resCalendarDto?.data);
            setLoaded(true);
        }
    }


    // 첫 컴포넌트 진입시(뒤로가기 포함), 최신 달력 상태 갱신을 위한 fetch 요청 로직이다.
    useLayoutEffect(() => {
        checkFetchData();
    }, []);


    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 현재 구현상 fetch 통신이 정상적으로 이뤄지고 달력이 존재하며 loaded가 true일때만 화면을 렌더링한다.
    // return 내부 속성에서 변수 접근시 만약의 경우 발생할 버그의 방어 코드이다 
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
    } else if (!loaded) { // 그렇지않으면 로딩 스피너가 돌아간다.
        return (
            <div className="container calendar-item-create-contents">
                <Loading navigator={navigator} />
            </div>
        )
    } else { // 여기 도달할 가능성은 거의 없지만 만일을 대비한 장치다.
        return (
            <div className="container calendar-item-create-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>
        );
    }

}

export default CalendarItemCreate;