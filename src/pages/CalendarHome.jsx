import { useNavigate } from "react-router-dom";



function CalendarHome(props) {

    console.log(props)
    const calendarResponseDtoList = props.data.calendarResponseDtoList;
    const calendarTotalSum = props.data.calendarTotalSum;
    console.log("calendarResponseDtoList", calendarResponseDtoList);
    console.log("calendarTotalSum", calendarTotalSum);

    return (
        <>
            <div class="calendar-home-container">

                <div class="calendar-create-btn-container">
                    <a href="/create" class="calendar-create-btn" > 새 달력 추가 </a>
                </div>


                <div class="calendar-total-sum-container">
                    <span> 총합 </span>

                    <div class="calendar-total-sum">

                        {calendarTotalSum > 0 &&
                            <span> {`+${calendarTotalSum}원`} </span>
                        }

                        {calendarTotalSum <= 0 &&
                            <span> {`${calendarTotalSum}원`} </span>
                        }

                    </div>

                </div>


                <div class="calendar-list-container">

                    {calendarResponseDtoList.length === 0 &&
                        <div> 달력이 존재하지 않습니다. </div>
                    }

                    {/* {calendarResponseDtoList.length > 0 &&

                        <div>
                            <table >
                                <thead class="calendar-list-thead" >
                                    <tr>
                                        <th>날짜</th>
                                        <th>제목</th>
                                        <th>합계</th>
                                        <th>수정</th>
                                    </tr>
                                </thead>

                                <tbody class="calendar-list-tbody" >

                                    <tr class="calendar-enter"

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



                                        <td th:onclick="|location.href='@{/calendar/{id}/item(id=${calendarResponseDto.id})}'|">
                                            <a th:href="@{/calendar/{id}/item(id=${calendarResponseDto.id})}" th:text="${calendarResponseDto.date}">
                                            </a>
                                        </td>

                                        <td th:onclick="|location.href='@{/calendar/{id}/item(id=${calendarResponseDto.id})}'|">
                                            <a th:href="@{/calendar/{id}/item(id=${calendarResponseDto.id})}" th:text="${calendarResponseDto.title}">
                                            </a>
                                        </td>

                                        <td th:onclick="|location.href='@{/calendar/{id}/item(id=${calendarResponseDto.id})}'|">
                                            <span th:if="${calendarResponseDto.totalAmount > 0}"
                                                th:text=" '+' + ${calendarResponseDto.totalAmount} + '원' "> 합계 </span>

                                            <span th:if="${calendarResponseDto.totalAmount <= 0}"
                                                th:text="${calendarResponseDto.totalAmount} + '원' "> 합계 </span>

                                        </td>


                                        <td class="edit-and-delete-btn-td">

                                            <button type="button" class="btn btn-link p-0 edit-btn"
                                                title="날짜, 제목 수정"
                                                data-bs-toggle="modal"
                                                data-bs-target="#editModal"
                                                th:attr="data-calendar-id=${calendarResponseDto.id}">
                                                <i class="bi bi-pencil"></i>
                                            </button>


                                            <button type="button" class="btn btn-link p-0 delete-btn"
                                                title="달력 삭제"
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                                th:attr="data-calendar-id=${calendarResponseDto.id}">
                                                <i class="bi bi-trash3"></i>
                                            </button>

                                        </td>


                                    </tr>
                                </tbody>

                            </table>

                        </div>

                    } */}

                </div>


            </div>


            {/* <!-- editModal --> */}
            {/* <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="editModalLabel">달력 수정</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            달력 날짜 및 제목을 수정하시겠습니까?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>

                            <form action="" method="get" style="display:inline;">
                                <button type="submit" class="btn btn-primary confirm-btn" >확인</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div> */}


            {/* <!-- deleteModal --> */}
            {/* <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="deleteModalLabel">달력 삭제</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            해당 달력을 삭제하시겠습니까?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>

                            <form action="" method="post" style="display:inline;">
                                <button type="submit" class="btn btn-primary" >확인</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div> */}



        </>



    );
}

export default CalendarHome;