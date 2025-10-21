import { useState, useLayoutEffect, useEffect } from 'react';
import '../styles/FetchError.css'

// 공용 fetch 함수인 fetchHandler에서 401이 아닌 모든 에러와, 401 중에서도 refreshFetchHandler()에서 실패한 경우는
// 모든 에러 객체가 종류에 따라 1차 편집되어 catchFlag를 통해 이곳에 도달한다.
// 이후 에러 객체를 다시 2차 편집하고 최종 에러 페이지를 표시한다.
function FetchError({ navigator, errorResInstance, loginModal, setLogin, loginModalInstance }) {

    console.log("FetchError 컴포넌트 실행됨");
    console.log("최상단 prop errorResInstance =>", errorResInstance);


    // 최종 2차 편집된 에러 객체를 담는 상태값이다
    const [finalErrorObject, setFinalErrorObject] = useState({
        errorStatus: 0,
        errorStatusText: ""
    });


    // 로그아웃 상태의 객체를 미리 선언하였다 
    const defaultLoginAtomData = {
        isLogin: false,
        user: {
            id: null,
            email: null,
            name: null,
            picture: null
        }
    }

    // 최종 2차 편집된 에러 객체를 반환받는 함수이다
    // 즉 매개변수로 1차 편집된 에러 객체를 받아서, 에러 객체 포맷을 통일하고 에러 메시지를 수정하여 반환한다 
    function getFinalErrorObject(errorInstance) {

        // 최종 2차 편집 에러를 담을 함수 내부의 임시 변수이다
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




        if (errorInstance.type === "errorJson") {
            // HTTP 오류이면서 에러가 json 파싱 되었을때 진입(Response.json 파싱 성공했을때)

            console.log("HTTP 오류이면서 에러가 json 파싱 되었을때 객체=>", errorInstance);

            finalErrorObject.errorStatus = errorInstance.data?.status;
            finalErrorObject.errorStatusText = errorInstance.data?.message;
        }


        else if (errorInstance instanceof Response) {
            // HTTP 오류이면서 에러가 json 파싱이 안되었을때 진입(Response 객체 자체일때)

            finalErrorObject.errorStatus = errorInstance.status;
            finalErrorObject.errorStatusText = errorInstance.statusText;
        }


        else {
            // 네트워크, 파싱 오류 등 일때 진입(에러의 근본적인 객체가 Response 객체가 아닐때)

            finalErrorObject.errorStatus = 0;
            finalErrorObject.errorStatusText = errorResInstance?.toString();
        }

        // 여기까지가 최종 2차편집 에러 객체 포맷을 일관되게 설정하는 로직이다.



        if (errorInstance.type === "errorJson") {
            // HTTP 오류이면서 에러가 json 파싱된 객체일때 입장(Response.json 파싱 성공했을때)

            switch (finalErrorObject.errorStatus) {
                case 403: finalErrorObject.errorStatusText = badRequestErrorMessage;
                    return finalErrorObject;
                default: return finalErrorObject;
            }


        } else {
            // errorInstance가 에러 객체 json 파싱 실패로 인한 Response 객체이거나,
            // fetch의 네트워크나 파싱 오류로 인한 에러 객체 일때 입장

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

    // 첫 컴포넌트 진입시(뒤로가기 포함),
    // props로 받은 1차 편집 에러 객체를 자동으로 최종 2차 편집하여 상태값에 저장해주는 로직이다 
    useLayoutEffect(() => {
        console.log("FetchError 컴포넌트 useLayoutEffect 실행됨");
        setFinalErrorObject(getFinalErrorObject(errorResInstance));
    }, []);




    useEffect(() => {
        // 401 에러일때(가장 가능성 높은것은 리프레시 토큰 재발급 인증이 실패한 정상적인 에러일때) => 자동으로 로그인 모달창을 띄우는 로직이다
        // useLayoutEffect 이후에 useEffect가 실행되고, 따라서 최종 편집된 객체가 저장되어있는 원리를 활용했다
        // 여기서 loginModal은 ServiceSection.jsx 밑의 LoginModal.jsx의 부트스트랩 로그인 모달 DOM이다
        // 여기서 loginModalInstance는 마찬가지로 LoginModal.jsx의 모달 DOM의 인스턴스를 1개만 유지하여 컴포넌트끼리 공유하도록 만든 useRef다
        // 모달 DOM 인스턴스가 여러개면 화면이 깨지는 등 오류가 나서 해결한 방법이다



        console.log("FetchError 컴포넌트 useEffect 실행됨");
        console.log("loginModal.current => ", loginModal.current);
        console.log("finalErrorObject.errorStatus =>", finalErrorObject.errorStatus);

        if (finalErrorObject.errorStatus === 401) {


            // 401 미인증 상태이므로 리액트 로그아웃 처리
            // 백엔드 서버의 로그아웃 처리는 이곳에 오기전 refreshFetchHandler에서 담당한다
            setLogin(defaultLoginAtomData);


            if (!loginModalInstance.current) {
                // 모달 인스턴스가 존재하지않으면 모달 DOM의 새 인스턴스를 생성

                loginModalInstance.current = new window.bootstrap.Modal(loginModal.current);
            }

            // 모달 인스턴스의 메서드를 이용해 로그인 모달창을 띄운다
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