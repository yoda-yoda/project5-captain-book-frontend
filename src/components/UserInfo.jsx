import "../styles/UserInfo.css"


function UserInfo({ login }) {

    // 리액트 전역 recoil login상태값에 정상적으로 데이터가 있을때 렌더링된다. 
    if (login?.user?.name) {

        return (
            <>
                <span className="user-greeting-span">
                    환영합니다!
                </span>
                <span className="user-info-name">
                    {login.user.name}
                </span>

            </>


        )

    }

    else {
        return null;
    }
}

export default UserInfo;