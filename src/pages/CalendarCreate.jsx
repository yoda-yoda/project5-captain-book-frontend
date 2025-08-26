import { useState, useEffect } from "react";
import "../styles/CalendarCreate.css"


function CalendarCreate({ navigator, fetchHandler, servicesSection }) {

    const [date, setDate] = useState();
    const [title, setTitle] = useState();

    const createRequestData = {
        date: date,
        title: title
    }


    const saveSubmitBtnHandler = async (e) => {
        e.preventDefault();
        await fetchHandler("/home", "POST", createRequestData);
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


            <div className="container calendar-create-contents">
                <form action="" onSubmit={(e) => { saveSubmitBtnHandler(e) }}>
                    <div>
                        <label htmlFor="date">날짜:</label>
                        <input type="date" id="date" name="date"
                            onChange={(e) => setDate(e.target.value)}
                            required />
                    </div>

                    <div>
                        <label htmlFor="title">제목:</label>
                        <input type="text" id="title" name="title" placeholder="제목을 입력하세요"
                            onChange={(e) => setTitle(e.target.value)}
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

export default CalendarCreate;