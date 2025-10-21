import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from "../components/Loading.jsx";
import '../styles/CalendarView.css'

// 달력 목록을 보여주는 페이지이다
function CalendarView({ navigator, fetchHandler, servicesSection }) {

    // const editModal = useRef(); //
    const [loaded, setLoaded] = useState(false);
    const [resDtoData, setResDtoData] = useState({
        calendarResponseDtoList: [
            {
                id: 0,
                date: "1111-11-11",
                title: "title",
                totalAmount: 0
            }
        ],
        calendarTotalSum: 0
    });


    const calendarResponseDtoList = resDtoData.calendarResponseDtoList;
    const calendarTotalSum = resDtoData.calendarTotalSum;

    // 데이터의 식별자를 중계하기위한 중계 변수들이다
    // 실제 데이터에 접근할수있는 DOM과 데이터를 처리하는 DOM 요소의 스코프가 분리되어있기때문이다
    let calendarResponseDtoVariable = {};
    let calendarId = "0";

    // 달력 수정 시도 버튼을 눌렀을때, 해당 달력 객체를 매개변수로 받아 중계 변수에 담아주는 핸들러이다
    const updateBtnClickHandler = (calendarResponseDto) => {
        calendarResponseDtoVariable = calendarResponseDto
    };

    // 달력 수정 페이지로 보내주는 달력 수정 버튼 핸들러이다
    const updateNavigateHandler = (calendarResponseDtoVariable) => {
        navigator(`/calendar/update/${calendarResponseDtoVariable.id}`);
    };

    // 특정 달력의 아이템 목록 페이지로 보내주는 핸들러이다
    const navigatorToItems = (calendarId) => {
        navigator(`/calendar/${calendarId}/item`);
    };

    // 달력 삭제 시도 버튼을 눌렀을때, 해당 달력 식별자를 매개변수로 받아 중계 변수에 담아주는 핸들러이다
    const deleteBtnClickHandler = (calendarResponseId) => {
        calendarId = calendarResponseId;
    };


    // 달력 삭제 DELETE 요청 핸들러이다 매개변수로는 중계 변수 calendarId가 들어간다
    // 삭제 요청 이후엔 다시 checkFetchData를 호출하여 새 달력 목록을 받아온다  
    const deleteNavigateHandler = async (calendarId) => {
        setLoaded(false);
        await fetchHandler(`/api/calendar/delete/${calendarId}`, "DELETE");
        checkFetchData();
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    };


    // 목적 달력 목록의 최신 상태를 받아오기위한 fetch 요청 핸들러이다
    async function checkFetchData() {

        setLoaded(false);
        const resDto = await fetchHandler(`/api/home`, "GET");

        // 현재 구현상, error가 발생하면 resDto는 undefined 이다
        // 공용 fetchHandler 내부에서 모든 에러가 처리되기 때문이다
        if (resDto) {

            // 데이터가 존재하면 상태값에 저장하고 loaded를 true로 만들어 화면을 표시한다
            setResDtoData(resDto?.data);
            setLoaded(true);
        }
    }


    // 첫 컴포넌트 진입시(뒤로가기 포함), 최신 달력 목록 갱신을 위한 fetch 요청 로직이다
    useLayoutEffect(() => {
        checkFetchData();
    }, []);




    useEffect(() => {
        // 자동스크롤
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // 현재 구현상 fetch 통신이 정상적으로 이뤄지고 달력이 존재하며 loaded가 true일때만 화면을 렌더링한다
    // return 내부 속성에서 변수 접근시 만약의 경우 발생할 undefined 에러의 방어 코드이다 
    if (calendarResponseDtoList && loaded) {
        return (
            <>

                {/* <!-- Section Title --> */}
                <div className="container section-title" data-aos="fade-up">
                    <h2> 대장부 </h2>
                    <p> calendar </p>
                </div>
                {/* <!-- End Section Title --> */}


                <div className="container">
                    <div className="row gy-4">

                        <div className="container calendar-view-contents" data-aos="fade-up">



                            <div className="calendar-create-btn-container" >
                                <Link to="/create" className="calendar-create-btn">+</Link>
                            </div>


                            <div className="calendar-total-sum-container">
                                <span> 총합 </span>

                                <div className="calendar-total-sum">

                                    {calendarTotalSum > 0 &&
                                        <span> {`+${calendarTotalSum}원`} </span>
                                    }

                                    {calendarTotalSum <= 0 &&
                                        <span> {`${calendarTotalSum}원`} </span>
                                    }

                                </div>

                            </div>


                            <div className="calendar-list-container">

                                {calendarResponseDtoList.length === 0 &&
                                    <div> 달력을 만들어 주세요. </div>
                                }

                                {calendarResponseDtoList.length > 0 &&

                                    <div>
                                        <table >
                                            <thead className="calendar-list-thead" >
                                                <tr>
                                                    <th>날짜</th>
                                                    <th>제목</th>
                                                    <th>합계</th>
                                                    <th>수정</th>
                                                </tr>
                                            </thead>

                                            <tbody className="calendar-list-tbody" >


                                                {calendarResponseDtoList.map((calendarResponseDto) => {
                                                    return (
                                                        <tr className="calendar-enter" key={calendarResponseDto.id}>

                                                            <td onClick={() => { navigatorToItems(calendarResponseDto.id) }}>
                                                                {calendarResponseDto.date}
                                                            </td>

                                                            <td className='calendar-td-title'
                                                                onClick={() => { navigatorToItems(calendarResponseDto.id) }}>
                                                                {calendarResponseDto.title}
                                                            </td>

                                                            <td
                                                                onClick={() => { navigatorToItems(calendarResponseDto.id) }}>
                                                                {calendarResponseDto.totalAmount > 0 && `+${calendarResponseDto.totalAmount}원`}
                                                                {calendarResponseDto.totalAmount <= 0 && `${calendarResponseDto.totalAmount}원`}
                                                            </td>

                                                            <td className="edit-and-delete-btn-td">

                                                                <button onClick={() => updateBtnClickHandler(calendarResponseDto)}
                                                                    type="button" className="btn btn-link p-0 edit-btn"
                                                                    title="날짜, 제목 수정"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#editModal"
                                                                >
                                                                    <i className="bi bi-pencil"></i>

                                                                </button>

                                                                <button onClick={() => deleteBtnClickHandler(calendarResponseDto.id)}
                                                                    type="button" className="btn btn-link p-0 delete-btn"
                                                                    title="달력 삭제"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#deleteModal"
                                                                >
                                                                    <i className="bi bi-trash3"></i>

                                                                </button>


                                                            </td>

                                                        </tr>

                                                    )
                                                })}


                                            </tbody>

                                        </table>

                                    </div>

                                }

                            </div>



                            {/* <!-- bootstrap editModal --> */}
                            <div
                                className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="editModalLabel">달력 수정</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            달력 날짜 및 제목을 수정하시겠습니까?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>

                                            <button
                                                onClick={() => {
                                                    updateNavigateHandler(calendarResponseDtoVariable);
                                                }}
                                                type="button" className="btn btn-primary confirm-btn" data-bs-dismiss="modal">확인</button>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* <!-- bootstrap deleteModal --> */}
                            <div
                                className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="deleteModalLabel">달력 삭제</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            해당 달력을 삭제하시겠습니까?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>

                                            <button
                                                onClick={() => {
                                                    deleteNavigateHandler(calendarId);
                                                }}
                                                type="button" className="btn btn-primary confirm-btn" data-bs-dismiss="modal">확인</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>


        );
    } else if (!loaded) { // 그렇지않으면 로딩 스피너가 돌아간다
        return (
            <div className="container calendar-view-contents">
                <Loading navigator={navigator} />
            </div>
        )
    } else { // 여기 도달할 가능성은 거의 없지만 만일을 대비한 장치다
        return (
            <div className="container calendar-view-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>
        );
    }
}

export default CalendarView;