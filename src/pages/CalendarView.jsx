import { Link } from 'react-router-dom'
import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import Loading from "../components/Loading.jsx";
import '../styles/CalendarView.css'

function CalendarView({ navigator, fetchHandler, servicesSection }) {


    console.log("CalendarView 실행")

    const editModal = useRef();
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


    let calendarResponseDtoVariable = {};
    let calendarId = "0";

    const updateBtnClickHandler = (calendarResponseDto) => {
        calendarResponseDtoVariable = calendarResponseDto
    };

    const updateNavigateHandler = (calendarResponseDtoVariable) => {
        navigator(`/calendar/update/${calendarResponseDtoVariable.id}`);
    };

    const navigatorToItems = (calendarId) => {
        navigator(`/calendar/${calendarId}/item`);
    };

    const deleteBtnClickHandler = (calendarResponseId) => {
        calendarId = calendarResponseId;
    };

    const deleteNavigateHandler = async (calendarId) => {
        setLoaded(false);
        await fetchHandler(`/api/calendar/delete/${calendarId}`, "DELETE");
        checkFetchData();
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    };


    async function checkFetchData() {

        setLoaded(false);
        const resDto = await fetchHandler(`/api/home`, "GET");

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
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });


    }, []);


    // calendarResponseDtoList 가 존재할때 jsx를 렌더링한다.
    // (내부 속성에 접근시 만약의 경우 발생할 undefined 에러의 방어 코드)
    if (calendarResponseDtoList && loaded) {
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
                            <div ref={editModal}
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
    } else if (!loaded) {
        return (
            <div className="container calendar-view-contents">
                <Loading />
            </div>
        )
    } else {
        return (
            <div className="container calendar-view-contents">
                <div> 데이터 접근에 문제가 발생하였습니다. </div>
            </div>
        );
    }
}

export default CalendarView;