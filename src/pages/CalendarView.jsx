import { Link } from 'react-router-dom'
import { useRef } from 'react'
import '../styles/CalendarView.css'

function CalendarView({ fetchData, handleOnClick, navigator, fetchHandler }) {

    const editModal = useRef();
    const calendarResponseDtoList = fetchData.calendarResponseDtoList;
    const calendarTotalSum = fetchData.calendarTotalSum;

    let calendarResponseDtoVariable = {};
    let calendarId = "0";

    const updateBtnClickHandler = (calendarResponseDto) => {
        calendarResponseDtoVariable = calendarResponseDto
    };

    const updateNavigateHandler = (calendarResponseDtoVariable) => {

        navigator(`/calendar/update/${calendarResponseDtoVariable.id}`,
            { state: { calendarResponseDtoVariable: calendarResponseDtoVariable } });
    };

    const deleteBtnClickHandler = (calendarResponseId) => {
        calendarId = calendarResponseId;
        console.log("calendarId", calendarId)

    };

    const deleteNavigateHandler = async (calendarId) => {
        await fetchHandler(`/calendar/delete/${calendarId}`);
        navigator("/home");
    };



    return (
        <>
            <div className="calendar-home-container" data-aos="fade-up">
              
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


                                    {calendarResponseDtoList.map((calendarResponseDto) => {
                                        return (
                                            <tr className="calendar-enter" key={calendarResponseDto.id}>

                                                <td>
                                                    <a onclick={handleOnClick(calendarResponseDto.id)}>
                                                        {calendarResponseDto.date}
                                                    </a>

                                                </td>

                                                <td>

                                                    <a onclick={handleOnClick(calendarResponseDto.id)}>
                                                        {calendarResponseDto.title}
                                                    </a>

                                                </td>

                                                <td>

                                                    <a onclick={handleOnClick(calendarResponseDto.id)}>
                                                        {calendarResponseDto.totalAmount > 0 && `+${calendarResponseDto.totalAmount}원`}
                                                        {calendarResponseDto.totalAmount <= 0 && `${calendarResponseDto.totalAmount}원`}
                                                    </a>

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


            </div>


            {/* <!-- bootstrap editModal --> */}
            <div ref={editModal}
                className="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
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
                className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
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

        </>


    );
}

export default CalendarView;