import CalendarView from "./CalendarView.jsx";
import Loading from "../components/Loading.jsx"

function CalendarHome({ fetchData, loaded, error }) {

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

                        


                        {!loaded && <Loading/> }


                        {/* loaded = true 이면서 정상이어야 렌더링*/}
                        {loaded && !error && <CalendarView fetchData={fetchData} /> }


                        {/* loaded = true 이면서 에러가 렌더링 */}
                        {loaded && error && <>에러남.에러남에러남에러남에러남 테스트중.</>}



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