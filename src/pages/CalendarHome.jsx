import { data, useNavigate } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";


function CalendarHome({fetchData}) {

    return (
        <>
            {/* <!-- Section Title --> */}
            <div className="container section-title" data-aos="fade-up">
                <h2> 달력 </h2>
                <p>Let's gilit</p>
            </div>
            {/* <!-- End Section Title --> */}

            <div className="container">
                <div className="row gy-4">

                    <div className="container contents">

                        <CalendarView fetchData={fetchData}/>


                        {/* {location.pathname === `/calendar/${id}/item` &&
             <CalendarHome calendarResponseDtoList={fetchData.calendarResponseDtoList} calendarTotalSum={data.calendarTotalSum} />}
            */}


                    </div>

                </div>
            </div>
        </>

    );
}

export default CalendarHome;