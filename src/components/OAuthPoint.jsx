import { useLayoutEffect } from "react";


function OAuthPoint() {

    useLayoutEffect(() => {

        // 서버에서 받은 URL 쿼리 파라미터에서 토큰을 추출
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');


        // url로 직접 접근한 경우를 방어하기 위한 로직이다.
        if (!accessToken) {

            if (!window.opener) {

                // 팝업이 아니면서 직접 접근한 경우 리다이렉트 처리한다.
                window.location.replace("/");
                return;
            }
        }

        // 해당 브라우저가 팝업창일 경우 진입한다. 성공한다면 부모 창에 토큰과 함께 메시지를 전송한다.
        if (window.opener && !window.opener.closed) {
            if (accessToken) {

                window.opener.postMessage({
                    type: "OAUTH_SUCCESS",
                    accessToken: accessToken
                }, "https://localhost:3000");
            }

        }
        // 정상적인 로직이 아닌 경우 팝업 창은 닫힌다.
        window.close();
    }, []);


    return null;
}

export default OAuthPoint;