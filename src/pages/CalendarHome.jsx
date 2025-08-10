import CalendarView from "./CalendarView.jsx";
import Loading from "../components/Loading.jsx"
import '../styles/CalendarHome.css'


function CalendarHome({ fetchData, loaded, error }) {

    console.log("CalendarHome 실행")

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

                    <div className="container calendar-contents">

                        {/* lodaing 중 */}
                        {!loaded && <Loading />}

                        {/* lodaing 중 (혹시 navigator로 /home/error 로 넘어가기 전에 이곳으로 렌더링됐다면 잠시 로딩하기 )*/}
                        {loaded && error && <Loading />}

                        {/* loaded = true, error =false 이어야 렌더링*/}
                        {loaded && !error && <CalendarView fetchData={fetchData} />}


                    </div>

                </div>
            </div>
        </>

    );
}

export default CalendarHome;