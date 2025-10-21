import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'


// 첫 화면 중앙의 시작 버튼이다
function StartBtn({ startBtnHandlerInRef }) {

    // 현재 modalOption 의 목적: 시작 버튼을 눌렀을때 만약 로그인 상태면 모달창이 뜨지 않게 하여
    // 정상 로직이 작동하도록 만들고, 로그아웃 상태면 모달창이 뜨도록 하여 로그인 과정을 유도하는 동적 변수다. 
    // 즉 recoil login 상태값에 따라 modalOption에 삼항연산자를 구현해
    // 버튼 DOM에 속성값을 동적으로 조정함으로써, 모달창의 표시 유무를 설정한다.

    // 현재 startBtnHandlerInRef 의 목적:
    // "로그인 유무에 (login.isLogin 상태값에) 따라 servicesSection을 확실하게 화면에 보이게하며
    // 달력 리스트를 요청하는 핸들러"를 공유하기위한 useRef이다.
    // 즉 콜백레지스트리 방식으로 servicesSection.jsx와 공유하며,
    // 버튼을 눌렀을때 작동할 함수를 servicesSection.jsx의 startBtnHandler 안에 작성하면 이 버튼과 자동으로 공유될것이다. 

    const [login] = useRecoilState(loginAtom);

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