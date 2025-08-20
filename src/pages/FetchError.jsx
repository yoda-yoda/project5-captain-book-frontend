import '../styles/FetchError.css'

function FetchError({errorResInstance}) {
    console.log("FetchError 컴포넌트 실행시작");
    console.log("FetchError errorResInstance",errorResInstance);
    console.log("FetchError errorResInstance.status",errorResInstance.status);
    console.log("FetchError errorResInstance.statusText",errorResInstance.statusText);

    

    

    function getErrorMessageForStatus (status) {

        switch(status) {
            case 0 : return "죄송합니다. 네트워크 오류 등이 발생했습니다.";
            case 500 : return "죄송합니다. 서버 오류가 발생했습니다.";
            default : return "죄송합니다. 알 수 없는 오류가 발생했습니다.";
        }
    }

    const customErrorMessage = getErrorMessageForStatus(errorResInstance.status);
    

    return (
        <>
            <div className="container">
                <div className="row gy-4">
                    <div className="container calendar-contents">
                        <div className="error-message">
                           <p>{customErrorMessage}</p>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )


}

export default FetchError;