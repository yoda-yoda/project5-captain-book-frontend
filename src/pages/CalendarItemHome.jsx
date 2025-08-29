import CalendarItemView from "../pages/CalendarItemView.jsx"
import Loading from "../components/Loading.jsx";
import "../styles/CalendarItemHome.css"


function CalendarItemHome({ fetchData, loaded, error, navigator, fetchHandler }) {
    console.log("CalendarItemHome 실행")

    return (
        <>

            <div className="container">
                <div className="row gy-4">

                    <div className="container calendar-item-contents">

                        {/* lodaing 중 */}
                        {!loaded && <Loading />}

                        {/* lodaing 중 (혹시나 navigator로 /home/error 로 넘어가기 전에 이곳으로 paint 됐을경우에 대비해 잠시 로딩표시 )*/}
                        {loaded && error && <Loading />}

                        {/* loaded = true, error =false 이어야 렌더링*/}
                        {loaded && !error && <CalendarItemView fetchData={fetchData} navigator={navigator} fetchHandler={fetchHandler} />}

                    </div>

                </div>
            </div>
        </>
    )
}

export default CalendarItemHome;