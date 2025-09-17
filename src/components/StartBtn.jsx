import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'

function StartBtn({ startBtnHandlerInRef }) {

    const [login, setLogin] = useRecoilState(loginAtom);

    const modalOption = login.isLogin
    ? {}
    : {"data-bs-toggle": "modal", "data-bs-target": "#loginModal" };

    return (
        <a className="btn-get-started"
            {...modalOption}
            onClick={() => startBtnHandlerInRef.current()}
        > 나의 가계부 시작 </a>
    )

}

export default StartBtn;