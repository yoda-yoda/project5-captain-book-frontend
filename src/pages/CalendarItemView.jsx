import { Link, useParams } from "react-router-dom";
import { useLayoutEffect } from "react";
import { selectedCalendarItem } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import '../styles/CalendarItemView.css'

function CalendarItemView({ fetchData, navigator, fetchHandler }) {

    // 만약 직전의 fetchData 객체 구조가 Calendar 도메인의 구조였다면,
    // 현재 fetchData.data의 속성들은 첫마운트의 paint전단계 까지만 undefined 이다.

    const [data, setData] = useRecoilState(selectedCalendarItem);

    const calendarResponseDto = data.calendarResponseDto;
    const calendarItemResponseDtoList = data.calendarItemResponseDtoList;
    const totalAmountDto = data.totalAmountDto;
    
    const { calendarId } = useParams();
    let calendarItemIdVariable = "0";
    

    const itemUpdateNavigateHandler = (calendarId, calendarItemResponseDto) => {

        navigator(`/calendar/${calendarId}/item/${calendarItemResponseDto.id}/update`,
            {
                state:
                {
                    calendarId: calendarId,
                    calendarResponseDto: calendarResponseDto,
                    calendarItemResponseDto: calendarItemResponseDto
                }
            });
    };

    const itemDeleteBtnClickHandler = (calendarItemResponseDtoId) => {
        calendarItemIdVariable = calendarItemResponseDtoId;
        console.log("calendarItemIdVariable", calendarItemIdVariable)

    };

    const itemDeleteNavigateHandler = async (calendarItemId) => {
        await fetchHandler(`/calendar/${calendarId}/item/${calendarItemId}/delete`, "DELETE");
        navigator(`/calendar/${calendarId}/item`);
    };


    //
    useLayoutEffect( () => {
        if(fetchData.data.calendarResponseDto) {
            setData(fetchData.data);
        }
    }, [])


    // calendarResponseDto 가 존재할때 jsx를 렌더링한다.
    // 존재한다는 것은 fetchData가 CalendarItem 속성 구조로 업데이트 됐다는 것이다.
    // fetch 완료전에 진행되는 컴포넌트 렌더링(가상DOM 생성) 중, 내부 속성에 접근할때 undefined 런타임에러에 대한 방어 코드이다.
    if (calendarResponseDto) {
        return (

            <>

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
                                                    <td>{calendarItemResponseDto.itemAmount}원</td>
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





            </>


        )
    } else {
        return (<div> 데이터 접근에 문제가 발생하였습니다. </div>)
    }
}

export default CalendarItemView;