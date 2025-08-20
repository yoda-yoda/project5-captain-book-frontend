import { Link } from 'react-router-dom'

import '../styles/CalendarView.css'


function CalendarView({ fetchData, handleOnClick }) {

    // console.log('CalendarView에 넘어온 fetchData (json 자체)', fetchData)

    const calendarResponseDtoList = fetchData.calendarResponseDtoList;
    const calendarTotalSum = fetchData.calendarTotalSum;
    // console.log('CalendarView에 넘어온 calendarResponseDtoList',calendarResponseDtoList)
    // console.log('CalendarView에 넘어온 calendarTotalSum', calendarTotalSum)

    return (
        <>
            <div className="calendar-home-container" data-aos="fade-up">
                {/* {location.pathname === `/calendar/${id}/item` &&
             <CalendarHome calendarResponseDtoList={fetchData.calendarResponseDtoList} calendarTotalSum={data.calendarTotalSum} />}
            */}
                <div className="calendar-create-btn-container" >
                    <Link to="/create" className="calendar-create-btn">새 달력 추가</Link>
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

                                    <tr className="calendar-enter"

                                    // th:each="calendarResponseDto : ${calendarResponseDtoList}"
                                    >
                                        {calendarResponseDtoList.map((calendarResponseDto) => {
                                            return (
                                                <td key={calendarResponseDto.id}>
                                
                                                    <a onclick = {handleOnClick(calendarResponseDto.id)}>
                                                        {calendarResponseDto.date}
                                                    </a>

                                                </td>

                                            )
                                        })}



                                        {/* <td onclick={console.log("hi")}>
                                            <a href="www.google.com">
                                                `${calendarResponseDto.date}`
                                            </a>
                                        </td> */}
                                                            
                                        {/* <td th:onclick="|location.href='@{/calendar/{id}/item(id=${calendarResponseDto.id})}'|">
                                            <a th:href="@{/calendar/{id}/item(id=${calendarResponseDto.id})}" th:text="${calendarResponseDto.title}">
                                            </a>
                                        </td> */}

                                        {/* <td th:onclick="|location.href='@{/calendar/{id}/item(id=${calendarResponseDto.id})}'|">
                                            <span th:if="${calendarResponseDto.totalAmount > 0}"
                                                th:text=" '+' + ${calendarResponseDto.totalAmount} + '원' "> 합계 </span>

                                            <span th:if="${calendarResponseDto.totalAmount <= 0}"
                                                th:text="${calendarResponseDto.totalAmount} + '원' "> 합계 </span>

                                        </td> */}


                                        {/* <td className="edit-and-delete-btn-td">

                                            <button type="button" className="btn btn-link p-0 edit-btn"
                                                title="날짜, 제목 수정"
                                                data-bs-toggle="modal"
                                                data-bs-target="#editModal"
                                                th:attr="data-calendar-id=${calendarResponseDto.id}">
                                                <i className="bi bi-pencil"></i>
                                            </button>


                                            <button type="button" className="btn btn-link p-0 delete-btn"
                                                title="달력 삭제"
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                                th:attr="data-calendar-id=${calendarResponseDto.id}">
                                                <i className="bi bi-trash3"></i>
                                            </button>

                                        </td> */}


                                    </tr>
                                </tbody>

                            </table>

                        </div>

                    }

                </div>


            </div>


            {/* <!-- editModal --> */}
            {/* <div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
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

                            <form action="" method="get" style="display:inline;">
                                <button type="submit" className="btn btn-primary confirm-btn" >확인</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div> */}


            {/* <!-- deleteModal --> */}
            {/* <div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
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

                            <form action="" method="post" style="display:inline;">
                                <button type="submit" className="btn btn-primary" >확인</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div> */}



        </>



    );
}

export default CalendarView;