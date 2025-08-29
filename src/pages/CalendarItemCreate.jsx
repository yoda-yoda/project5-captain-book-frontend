import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/CalendarItemCreate.css"

function CalendarItemCreate({ navigator, location, fetchHandler, servicesSection }) {

    const { calendarId } = useParams();
    const [itemTitle, setItemTitle] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [type, setType] = useState();
    const [calendarResponseDto] = useState(location.state?.calendarResponseDto);
   

    const createItemRequestData = {
        itemTitle: itemTitle,
        itemAmount: itemAmount,
        type: type
    }

    const itemSaveSubmitBtnHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/calendar/${calendarId}/item`, "POST", createItemRequestData);
        navigator(`/calendar/${calendarId}/item`);
    }

    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    console.log("calendarResponseDto", calendarResponseDto)


    return (

        <>

            {/* <!-- Section Title --> */}
            <div className="container section-title">
                <h2> 달력: {calendarResponseDto.date} </h2>
                <h2> 제목: {calendarResponseDto.title}</h2>

                <div className="fallback-btn-container" >
                    <button onClick={() => navigator(-1)} className="fallback-btn">뒤로가기</button>
                </div>

                <div className="calendar-home-btn-container" >
                    <Link to="/home" className="calendar-home-btn">홈</Link>
                </div>
            </div>
            {/* <!-- End Section Title --> */}


            <div className="container calendar-item-create-contents">


                <form action="" onSubmit={(e) => { itemSaveSubmitBtnHandler(e) }}>
                    <div>
                        <label htmlFor="item-title">항목명:</label>
                        <input type="text" id="item-title" name="itemTitle" placeholder="항목명을 입력하세요"
                            onChange={(e) => setItemTitle(e.target.value)}
                            maxLength={45}
                            required />
                    </div>


                    <div>
                        <label htmlFor="item-amount">금액:</label>
                        <input type="number" id="item-amount" name="itemAmount" placeholder="금액을 입력하세요"
                            onChange={(e) => setItemAmount(e.target.value)}
                            required min="0" max="999999999999" />

                        <label>
                            <input type="radio" name="type" value="EXPENSE"
                                checked={type === "EXPENSE"}
                                onChange={(e) => setType(e.target.value)}
                                required />
                            지출
                        </label>
                        <label>
                            <input type="radio" name="type" value="INCOME"
                                checked={type === "INCOME"}
                                onChange={(e) => setType(e.target.value)}
                            />
                            수입
                        </label>

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

export default CalendarItemCreate;