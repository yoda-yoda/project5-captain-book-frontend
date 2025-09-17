import { useState, useEffect } from "react";
import "../styles/CalendarCreate.css"

function CalendarCreate({ navigator, fetchHandler, servicesSection }) {

    const [date, setDate] = useState();
    const [title, setTitle] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createRequestData = {
        date: date,
        title: title
    }

    const maxDate = "9999-12-31"


    const saveSubmitBtnHandler = async (e) => {
        e.preventDefault();

        // 중복 제출 방지
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        await fetchHandler("/api/home", "POST", createRequestData);
        navigator("/home");
    }

    useEffect(() => {
        // 자동 스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);





    return (

        <div className="container">
            <div className="row gy-4">
                <div className="container calendar-create-contents">


                    <button onClick={() => navigator("/home")} className="home-btn-container-calendar-create">
                        <i className="bi bi-house-door-fill home-btn" />
                    </button>


                    <hr id="create-top-hr" className="top-hr"></hr>

                    <div className="container top-box">

                        <h3 className="calendar-create-h3">달력 만들기</h3>

                    </div>

                    <hr id="create-top-hr" className="top-hr"></hr>



                    <div className="container calendar-create-inner-contents">
                        <form action="" onSubmit={(e) => { saveSubmitBtnHandler(e) }}>

                            <div className="container create-data-flex-box">
                                <div className="container create-data-flex-input-box">
                                    <div>
                                        <label htmlFor="date">
                                            <span className="create-date">날짜:</span>
                                        </label>
                                        <input
                                            className="create-date-input"
                                            type="date" id="date" name="date"
                                            onChange={(e) => setDate(e.target.value)}
                                            max={maxDate}
                                            required />
                                    </div>

                                    <div>
                                        <label htmlFor="title">
                                            <span className="create-title">제목:</span>
                                        </label>
                                        <input
                                            className="create-title-input"
                                            type="text" id="title" name="title" placeholder="제목을 입력하세요"
                                            maxLength={35}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required />
                                    </div>
                                </div>

                                <button className="calendar-create-btn" type="submit">
                                    <i className="bi bi-check-lg"></i>
                                </button>
                            </div>
                        </form>


                    </div>

                </div>
            </div>
        </div>
    )

}

export default CalendarCreate;