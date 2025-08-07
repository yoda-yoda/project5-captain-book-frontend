import { useLayoutEffect } from "react";
import { useEffect } from "react";

function StartBtn({ startBtnHandlerInRef }) {

    return (
        <a className="btn-get-started"
            onClick={() => startBtnHandlerInRef.current()}
        > 나의 가계부 시작 </a>
    )

}

export default StartBtn;