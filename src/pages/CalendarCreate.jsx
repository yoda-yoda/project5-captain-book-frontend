import { useState } from "react";
import "../styles/CalendarCreate.css"
import { useNavigate } from "react-router-dom";


function CalendarCreate({navigator, fetchHandler}) {

    console.log("CalendarCreate 컴포넌트 실행")

    const [date, setDate] = useState();
    const [title, setTitle] = useState();
    
    const requestData = {
        date: date,
        title: title
    }

    // console.log(date);
    // console.log(title);



    const submitHandler = async (e) => {
        e.preventDefault();
        await fetchHandler("/home", requestData);
        navigator("/home");
    }
  

    return (

        <>
            {/* <!-- Section Title --> */}
            <div className="container section-title" >
                <h2> 달력 </h2>
                <p>Let's gilit</p>
            </div>
            {/* <!-- End Section Title --> */}


            <div className="container calendar-contents">

                <form onSubmit={submitHandler} method="post">
                    <div>
                        <label htmlFor="date">날짜:</label>
                        <input type="date" id="date" name="date"
                        onChange={ (e) => setDate(e.target.value) }
                        required />
                    </div>

                    <div>
                        <label htmlFor="title">제목:</label>
                        <input type="text" id="title" name="title" placeholder="제목을 입력하세요"
                        onChange={ (e) => setTitle(e.target.value) }
                        required />
                    </div>

                    <div>
                        <button type="submit">저장</button>
                    </div>
                </form>

            </div>
        </>
    )

}

export default CalendarCreate;