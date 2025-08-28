import '../styles/FetchError.css'

function FetchError({ errorResInstance }) {


    function getErrorMessageForStatus(errorInstance) {

        let errorStatus = 0;
        let errorStatusText = "";

        // HTTP 오류일때(Response 객체가 할당됨)
        if (errorInstance instanceof Response) {
            errorStatus = errorInstance.status;
            errorStatusText = errorInstance.statusText;
        }
        // 네트워크, 파싱 오류 등 일때(에러 객체가 Response 객체가 아닐때)
        else {
            errorStatus = 0;
            errorStatusText = errorResInstance.toString();
        }

        const networkErrorMessage = <p>죄송합니다. 네트워크 오류 등이 발생했습니다.</p>
        const dataHandleFailMessage = <p>죄송합니다. 데이터 처리에 실패하였습니다.</p>
        const defaultErrorMessage = <> <p>죄송합니다. 알 수 없는 오류가 발생했습니다. </p> <p>나중에 다시 시도해주세요.</p> </>
        const serverErrorMessage = <p>죄송합니다. 서버 응답을 처리할 수 없습니다.</p>

        switch (errorStatus) {
            case 0:
                if (errorStatusText.includes("Failed to fetch")) {
                    return networkErrorMessage;
                }
                else if (errorStatusText.includes("SyntaxError") || errorStatusText.includes("json")) {
                    return dataHandleFailMessage;
                } else { return defaultErrorMessage; }

            case 500: return serverErrorMessage;
            
            default: return defaultErrorMessage;
        }
    }

    let customErrorMessage = getErrorMessageForStatus(errorResInstance);


    return (
        <>
            <div className="container">
                <div className="row gy-4">
                    <div className="container calendar-contents">
                        <div className="error-message-container">
                            {customErrorMessage}
                        </div>
                    </div>
                </div>
            </div>



        </>
    )


}

export default FetchError;