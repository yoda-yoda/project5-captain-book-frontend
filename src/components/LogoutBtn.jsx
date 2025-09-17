import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import { useLayoutEffect } from 'react';
import Cookies from 'js-cookie';
import "../styles/LogoutBtn.css"


function LogoutBtn({ setLogin, fetchHandlerInRef}) {


    const defaultLoginAtomData = {
        isLogin: false,
        user: {
            id: null,
            email: null,
            name: null,
            picture: null
        }
    }


    return (
        <a id="logoutBtn"
            onClick={ async () => {
                await fetchHandlerInRef.current("/api/logout", "POST");
                setLogin(defaultLoginAtomData);
                window.location.href = "/";

            }}
        >로그아웃</a>
    )

}

export default LogoutBtn;