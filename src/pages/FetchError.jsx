import { useState, useLayoutEffect } from 'react';
import '../styles/FetchError.css'

function FetchError({ navigator, errorResInstance }) {
    console.log("FetchError 컴포넌트 실행됨");
    console.log("errorResInstance =>", errorResInstance);


    const [customErrorMessage, setCustomErrorMessage] = useState("");



    function getErrorMessageForStatus(errorInstance) {

        let errorStatus = 0;
        let errorStatusText = "";


        // HTTP 오류이면서 에러가 json 파싱 되었을때(Response.json 파싱 성공했을때)
        if (errorInstance.type === "errorJson") {
            errorStatus = errorInstance.data?.status;
            errorStatusText = errorInstance.data?.message;
        }


        // HTTP 오류이면서 에러가 json 파싱이 안되었을때(Response 객체 자체일때)
        else if (errorInstance instanceof Response) {
            console.log("이건안나와야지");
            errorStatus = errorInstance.status;
            errorStatusText = errorInstance.statusText;
        }


        // 네트워크, 파싱 오류 등 일때(에러의 근본적인 객체가 Response 객체가 아닐때)
        else {
            errorStatus = 0;
            errorStatusText = errorResInstance?.toString();
        }



        const networkErrorMessage = <> <p>죄송합니다. 네트워크 오류 등이 발생했습니다.</p> <p>나중에 다시 시도해주세요.</p> </>
        const dataHandleFailMessage = <> <p>죄송합니다. 데이터 처리에 실패하였습니다.</p> <p>나중에 다시 시도해주세요.</p> </>
        const defaultErrorMessage = <> <p>죄송합니다. 알 수 없는 오류가 발생했습니다. </p> <p>나중에 다시 시도해주세요.</p> </>
        const serverErrorMessage = <> <p>죄송합니다. 서버 응답을 처리할 수 없습니다.</p> <p>나중에 다시 시도해주세요.</p> </>
        const notFoundErrorMessage = <> <p>죄송합니다. 요청한 리소스를 찾을 수 없습니다. </p> <p>나중에 다시 시도해주세요.</p> </>
        const badRequestErrorMessage = <> <p>죄송합니다. 잘못된 요청입니다. </p> <p>나중에 다시 시도해주세요.</p> </>


        if (errorInstance.type === "errorJson") { // errorInstance가 정상적인 json 파싱된 객체일때 입장

            return errorStatusText;

        } else { // errorInstance가 에러 객체의 json 파싱 실패로 Response 객체이거나, fetch의 네트워크나 파싱 오류로 인한 에러 객체 일때 입장
            switch (errorStatus) {
                case 0:
                    if (errorStatusText.includes("Failed to fetch")) {
                        return networkErrorMessage;
                    }
                    else if (errorStatusText.includes("SyntaxError") || errorStatusText.includes("json")) {
                        return dataHandleFailMessage;
                    } else {
                        return defaultErrorMessage;
                    }


                case 400: return badRequestErrorMessage;
                case 404: return notFoundErrorMessage;
                case 500: return serverErrorMessage;

                default: return defaultErrorMessage;
            }
        }
    }



    useLayoutEffect(() => {
        console.log("FetchError 컴포넌트 useLayoutEffect 실행됨");
        setCustomErrorMessage(getErrorMessageForStatus(errorResInstance));
    }, []);



    return (
        <div className="container">
            <div className="row gy-4">
                <div className="container calendar-contents">


                    {/* <!-- Start item top --> */}
                    <button onClick={() => navigator("/home")} className="error-home-btn-container">
                        <i className="bi bi-house-door-fill error-home-btn" />
                    </button>

                    <hr id="top-hr" className="error-top-hr"></hr>
                    {/* <!-- End item top --> */}
                    

                    <div className="error-message-container">

                        <div className="error-message-header">
                            <img src="/img/error-alert.png" className="error-img-alert" alt="" />
                            <h2>Error</h2>
                        </div>
                        <span className="error-message-span"> {customErrorMessage} </span>
                    </div>



                </div>
            </div>
        </div>
    )


}

export default FetchError;