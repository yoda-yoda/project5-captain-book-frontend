import { useLayoutEffect, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import '../styles/CalendarItemView.css'


// 달력 속 아이템 목록을 보여주는 페이지이다
// 명세상 아이템은 없어도 되지만 상위 객체인 달력은 반드시 존재하는것이 정상이다
function CalendarItemView({ navigator, fetchHandler, servicesSection }) {


    const { calendarId } = useParams();
    const [resDtoData, setResDtoData] = useState({
        calendarResponseDto: null,
        calendarItemResponseDtoList: [],
        totalAmountDto: {}
    });
    const [loaded, setLoaded] = useState(false);

    const calendarResponseDto = resDtoData.calendarResponseDto;
    const calendarItemResponseDtoList = resDtoData.calendarItemResponseDtoList;
    const totalAmountDto = resDtoData.totalAmountDto;
    const itemTypePlus = "수입"; // 현재 명세상 "수입"
    const itemTypeMinus = "지출"; // 현재 명세상 "지출"


    // 데이터의 식별자를 중계하기위한 중계 변수이다
    // 실제 데이터에 접근할수있는 DOM과 데이터를 처리하는 DOM 요소의 스코프가 분리되어있기때문이다
    let calendarItemIdVariable = "0";


    // 아이템 수정 페이지로 보내주는 아이템 수정 버튼 핸들러이다
    const itemUpdateNavigateHandler = (calendarId, calendarItemResponseDto) => {

        navigator(`/calendar/${calendarId}/item/${calendarItemResponseDto.id}/update`);
    };


    // 아이템 삭제 시도 버튼을 눌렀을때, 해당 아이템 식별자를 매개변수로 받아 중계 변수에 담아주는 핸들러이다
    const itemDeleteBtnClickHandler = (calendarItemResponseDtoId) => {
        calendarItemIdVariable = calendarItemResponseDtoId;
    };


    // 아이템 삭제 DELETE 요청 핸들러이다 매개변수로는 중계 변수 calendarItemIdVariable 이 들어간다
    // 삭제 요청 이후엔 다시 checkFetchData를 호출하여 새 아이템 목록을 받아온다  
    const itemDeleteNavigateHandler = async (calendarItemId) => {
        setLoaded(false);
        await fetchHandler(`/api/calendar/item/${calendarItemId}/delete`, "DELETE");
        checkFetchData();
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    };


    // 목적: 달력의 최신 상태와 아이템 목록의 최신 상태를 받아오기위한 fetch 요청 핸들러이다
    async function checkFetchData() {

        // 요청이 끝나기전까지 혹시 모를 상황과 명확함을 위해 setLoaded(false)를 호출한다
        // 어차피 이미 false 상태라면 작동을 하지않고 넘어간다 
        setLoaded(false);

        const resDto = await fetchHandler(`/api/calendar/${calendarId}/item`, "GET");

        // 현재 구현상, error가 발생하면 resDto는 undefined 이다
        // 공용 fetchHandler 내부에서 모든 에러가 처리되기 때문이다
        if (resDto) {
            // 데이터가 존재하면 상태값에 저장하고 loaded를 true로 만들어 화면을 표시한다

            setResDtoData(resDto?.data);
            setLoaded(true);
        }
    }


    // 첫 컴포넌트 진입시(뒤로가기 포함), 최신 데이터값 갱신을 위한 fetch 요청 로직이다
    useLayoutEffect(() => {
        checkFetchData();
    }, []);


    useEffect(() => {
        // 자동스크롤
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 현재 구현상 fetch 통신이 정상적으로 이뤄지고 달력이 존재하며 loaded가 true일때만 화면을 렌더링한다
    // return 내부 속성에서 변수 접근시 만약의 경우 발생할 undefined 에러의 방어 코드이다 
    if (calendarResponseDto && loaded) {
        return (

            <div className="container">
                <div className="row gy-4">

                    <div className="container calendar-item-view-contents">

                        {/* <!-- Start item top --> */}
                        <button onClick={() => navigator("/home")} className="home-btn-container"
                            data-aos="fade-in">
                            <i className="bi bi-house-door-fill home-btn" />
                        </button>

                        <hr id="top-hr" className="top-hr" data-aos="fade-in"></hr>

                        <div className="container top-box" data-aos="fade-in">

                            <div className="container top-date">
                                <span className="top-calendar-date">달력</span>
                                <h3> {calendarResponseDto.date} </h3>
                            </div>

                            <div className="container top-title">
                                <span className="top-calendar-title">제목</span>
                                <h3> {calendarResponseDto.title}</h3>
                            </div>

                        </div>

                        <hr id="top-hr" className="top-hr" data-aos="fade-in"></hr>
                        {/* <!-- End item top --> */}




                        <div className="item-button-box-container" data-aos="fade-up">

                            <Link to={`/calendar/${calendarId}/item/create`}
                                state={{ calendarResponseDto: calendarResponseDto }}
                                className="calendar-item-create-btn"> + </Link>

                        </div>

                        <div className="calendar-item-container" data-aos="fade-up">


                            <div className="calendarItem-total-sum-container">
                                <span> 총합 </span>

                                <div className="calendarItem-total-sum">

                                    {totalAmountDto.totalAmount > 0 &&
                                        <span>+{totalAmountDto.totalAmount}원</span>}
                                    {totalAmountDto.totalAmount <= 0 &&
                                        <span>{totalAmountDto.totalAmount}원</span>}

                                </div>

                            </div>


                            <div className="calendarItem-list-container">


                                {calendarItemResponseDtoList.length === 0 &&
                                    <div className="calendarItem-list"> 새 항목을 추가해 주세요. </div>}

                                {calendarItemResponseDtoList.length > 0 &&

                                    <div className="calendarItem-list">

                                        <div className="totalAmount-container">
                                            <span className="item-totalMinus">누적 지출: {totalAmountDto.totalMinus}원 </span>
                                            <br></br>
                                            <span className="item-totalPlus">누적 수입: {totalAmountDto.totalPlus}원 </span>
                                        </div>

                                        <table>
                                            <thead className="calendarItem-list-thead">
                                                <tr>
                                                    <th>항목명</th>
                                                    <th>금액</th>
                                                    <th>종류</th>
                                                    <th colSpan="2">작업</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {calendarItemResponseDtoList.map((calendarItemResponseDto) => {
                                                    return (
                                                        <tr key={calendarItemResponseDto.id}>

                                                            <td className='item-td-title'>{calendarItemResponseDto.itemTitle}</td>
                                                            <td>
                                                                {calendarItemResponseDto.itemType === itemTypePlus && `+${calendarItemResponseDto.itemAmount}원`}
                                                                {calendarItemResponseDto.itemType === itemTypeMinus && `-${calendarItemResponseDto.itemAmount}원`}
                                                            </td>


                                                            <td>{calendarItemResponseDto.itemType}</td>


                                                            <td className="itemEdit-and-itemDelete-btn-td">

                                                                <button onClick={() => itemUpdateNavigateHandler(calendarId, calendarItemResponseDto)}
                                                                    type="button" className="btn btn-link p-0 itemEdit-btn"
                                                                    title="항목 수정"
                                                                > <i className="bi bi-pencil"></i>
                                                                </button>

                                                                <button onClick={() => itemDeleteBtnClickHandler(calendarItemResponseDto.id)}
                                                                    type="button" className="btn btn-link p-0 itemDelete-btn"
                                                                    title="항목 삭제"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#itemDeleteModal"
                                                                ><i className="bi bi-trash3"></i>

                                                                </button>

                                                            </td>


                                                        </tr>
                                                    )
                                                })
                                                }

                                            </tbody>
                                        </table>


                                    </div>

                                }

                            </div>

                        </div>


                        {/* <!-- bootstrap itemDeleteModal --> */}
                        <div
                            className="modal fade" id="itemDeleteModal" tabIndex="-1" aria-labelledby="itemDeleteModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="itemDeleteModalLabel">항목 삭제</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        해당 항목을 삭제하시겠습니까?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>

                                        <button
                                            onClick={() => {
                                                itemDeleteNavigateHandler(calendarItemIdVariable);
                                            }}
                                            type="button" className="btn btn-primary confirm-btn" data-bs-dismiss="modal">확인</button>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        )
    } else if (!loaded) { // 그렇지않으면 로딩 스피너가 돌아간다
        return (

            <div className="container calendar-item-view-contents">
                <Loading navigator={navigator} />
            </div>


        )
    } else { // 여기 도달할 가능성은 거의 없지만 만일을 대비한 장치다
        return (
            <div className="container calendar-item-view-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>
        )
    }
}

export default CalendarItemView;