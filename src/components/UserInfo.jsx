import "../styles/UserInfo.css"


function UserInfo({ login }) {

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