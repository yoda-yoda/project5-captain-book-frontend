import { Link, useParams } from "react-router-dom";
import { useLayoutEffect, useEffect, useState } from "react";
import Loading from "../components/Loading.jsx";
import '../styles/CalendarItemView.css'

function CalendarItemView({ navigator, fetchHandler, servicesSection }) {

    console.log("CalendarItemView 실행")

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

    let calendarItemIdVariable = "0";


    const itemUpdateNavigateHandler = (calendarId, calendarItemResponseDto) => {

        navigator(`/calendar/${calendarId}/item/${calendarItemResponseDto.id}/update`);
    };

    const itemDeleteBtnClickHandler = (calendarItemResponseDtoId) => {
        calendarItemIdVariable = calendarItemResponseDtoId;
        console.log("calendarItemIdVariable", calendarItemIdVariable);
    };

    const itemDeleteNavigateHandler = async (calendarItemId) => {
        setLoaded(false);
        await fetchHandler(`/api/calendar/item/${calendarItemId}/delete`, "DELETE");
        checkFetchData();
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    };


    
    async function checkFetchData() {
        
        setLoaded(false);
        const resDto = await fetchHandler(`/api/calendar/${calendarId}/item`, "GET");

        // 현재 구현상 error가 발생하면 resDto는 undefined 이다.
        if (resDto) {
            setResDtoData(resDto?.data);
            setLoaded(true);
        }
    }


    // 렌더링 진입시(뒤로가기 포함) 최신 데이터 갱신을 위한 useLayoutEffect의 fetch 로직이다.
    useLayoutEffect(() => {
        checkFetchData();
    }, []);

    useEffect(() => {
        servicesSection.current.scrollIntoView({ behavior: 'smooth' });
    }, []);



    // calendarResponseDto 가 존재할때 jsx를 렌더링한다.
    // (내부 속성에 접근시 만약의 경우 발생할 undefined 에러의 방어 코드)
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
                            {/* <button onClick={ () => navigator("/home")} className="fall-back-container">
                         <i class="bi bi-arrow-left-circle-fill fall-back"></i>
                    </button> */}



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
    } else if (!loaded) {
        return (

            <div className="container calendar-item-view-contents">
                <Loading />
            </div>


        )
    } else {
        return (
            <div className="container calendar-item-view-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>
        )
    }
}

export default CalendarItemView;