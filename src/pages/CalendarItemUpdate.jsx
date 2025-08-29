import { useState, useEffect } from "react";
import "../styles/CalendarItemUpdate.css"

function CalendarItemUpdate({ navigator, location, fetchHandler, servicesSection }) {

    const calendarItemResponseDto = location.state.calendarItemResponseDto;
    const calendarResponseDto = location.state.calendarResponseDto;
    const calendarId = location.state.calendarId;

    const [itemTitle, setItemTitle] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [type, setType] = useState();

    const updateRequestData = {
        itemTitle: itemTitle,
        itemAmount: itemAmount,
        type: type
    }

    console.log("itemTitle", itemTitle);
    console.log("itemAmount", itemAmount);
    console.log("type", type);

    const updateBtnClickHandler = async (e) => {
        e.preventDefault();
        await fetchHandler(`/calendar/${calendarId}/item/${calendarItemResponseDto.id}/update`, "PUT", updateRequestData);
        navigator(`/calendar/${calendarId}/item`);
    }

    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (


        <div className="container">
            <div className="row gy-4">

                <div className="container calendar-item-contents">


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



                    <div className="container calendar-item-update-contents">

                        <form action="" onSubmit={(e) => { updateBtnClickHandler(e) }}>
                            <div className="container update-data-flex-box">
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
}

export default CalendarItemUpdate;