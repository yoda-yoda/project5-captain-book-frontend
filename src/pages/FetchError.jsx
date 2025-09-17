import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import '../styles/FetchError.css'

function FetchError({ navigator, errorResInstance, loginModal, setLogin }) {
    console.log("FetchError 컴포넌트 실행됨");
    console.log("errorResInstance =>", errorResInstance);

    const loginModalInstance = useRef(null);

    const [finalErrorObject, setFinalErrorObject] = useState({
        errorStatus: 0,
        errorStatusText: ""
    });

    const defaultLoginAtomData = {
        isLogin: false,
        user: {
            id: null,
            email: null,
            name: null,
            picture: null
        }
    }



    function getFinalErrorObject(errorInstance) {

        let finalErrorObject = {
            errorStatus: 0,
            errorStatusText: ""
        };


        const networkErrorMessage = <> <p>죄송합니다. 네트워크 오류 등이 발생했습니다.</p> <p>나중에 다시 시도해주세요.</p> </>
        const dataHandleFailMessage = <> <p>죄송합니다. 데이터 처리에 실패하였습니다.</p> <p>나중에 다시 시도해주세요.</p> </>
        const defaultErrorMessage = <> <p>죄송합니다. 알 수 없는 오류가 발생했습니다. </p> <p>나중에 다시 시도해주세요.</p> </>
        const serverErrorMessage = <> <p>죄송합니다. 서버 응답을 처리할 수 없습니다.</p> <p>나중에 다시 시도해주세요.</p> </>
        const notFoundErrorMessage = <> <p>죄송합니다. 요청한 리소스를 찾을 수 없습니다. </p> <p>나중에 다시 시도해주세요.</p> </>
        const badRequestErrorMessage = <> <p>죄송합니다. 잘못된 요청입니다. </p> <p>나중에 다시 시도해주세요.</p> </>



        // HTTP 오류이면서 에러가 json 파싱 되었을때(Response.json 파싱 성공했을때)
        if (errorInstance.type === "errorJson") {
            finalErrorObject.errorStatus = errorInstance.data?.status;
            console.log("@#@##@##@#@#@#@#", errorInstance)
            finalErrorObject.errorStatusText = errorInstance.data?.message;
        }


        // HTTP 오류이면서 에러가 json 파싱이 안되었을때(Response 객체 자체일때)
        else if (errorInstance instanceof Response) {
            finalErrorObject.errorStatus = errorInstance.status;
            finalErrorObject.errorStatusText = errorInstance.statusText;
        }


        // 네트워크, 파싱 오류 등 일때(에러의 근본적인 객체가 Response 객체가 아닐때)
        else {
            finalErrorObject.errorStatus = 0;
            finalErrorObject.errorStatusText = errorResInstance?.toString();
        }
        // 여기까지 finalErrorObject 객체를 일관되게 설정한다.





        if (errorInstance.type === "errorJson") { // errorInstance가 정상적인 json 파싱된 객체일때 입장
            switch (finalErrorObject.errorStatus) {
                case 403: finalErrorObject.errorStatusText = badRequestErrorMessage;
                    return finalErrorObject;
                default: return finalErrorObject;
            }


        } else { // errorInstance가 에러 객체의 json 파싱 실패로 Response 객체이거나, fetch의 네트워크나 파싱 오류로 인한 에러 객체 일때 입장
            switch (finalErrorObject.errorStatus) {
                case 0:
                    if (finalErrorObject.errorStatusText.includes("Failed to fetch")) {
                        finalErrorObject.errorStatusText = networkErrorMessage;
                        return finalErrorObject;
                    }
                    else if (finalErrorObject.errorStatusText.includes("SyntaxError") ||
                        finalErrorObject.errorStatusText.includes("json")) {
                        finalErrorObject.errorStatusText = dataHandleFailMessage;
                        return finalErrorObject;
                    } else {
                        finalErrorObject.errorStatusText = defaultErrorMessage;
                        return finalErrorObject;
                    }


                case 400: finalErrorObject.errorStatusText = badRequestErrorMessage;
                    return finalErrorObject;
                case 404: finalErrorObject.errorStatusText = notFoundErrorMessage;
                    return finalErrorObject;
                case 500: finalErrorObject.errorStatusText = serverErrorMessage;
                    return finalErrorObject;
                default: finalErrorObject.errorStatusText = defaultErrorMessage;
                    return finalErrorObject;
            }
        }
    }


    useLayoutEffect(() => {
        console.log("FetchError 컴포넌트 useLayoutEffect 실행됨");
        setFinalErrorObject(getFinalErrorObject(errorResInstance));
    }, []);


    // 에러가 나면 이 컴포넌트로 도달할텐데,  401 에러(인증실패) 일때 로그인 모달을 작동시키는 로직이다.  
    useEffect(() => {
        console.log("FetchError 컴포넌트 useEffect 실행됨");
        console.log("loginModal@@@@@@@@@@@@@", loginModal.current);
        console.log("finalErrorObject.errorStatus@@@@@@@@@@@@@", finalErrorObject.errorStatus);

        if (finalErrorObject.errorStatus === 401) {

            setLogin(defaultLoginAtomData);

            if (!loginModalInstance.current) {
                loginModalInstance.current = new window.bootstrap.Modal(loginModal.current);
            }
            loginModalInstance.current.show();
        }

    }, [finalErrorObject]);




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
                        <span className="error-message-span"> {finalErrorObject.errorStatusText} </span>
                    </div>



                </div>
            </div>
        </div>
    )


}

export default FetchError;