import { loginAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'
import LoginMainBtn from "./LoginMainBtn.jsx";
import LogoutBtn from './LogoutBtn.jsx';
import UserInfo from './UserInfo.jsx';
import "../styles/MainHeader.css"


function MainHeader({ loginMainBtnHandlerInRef, fetchHandlerInRef }) {

    const [login, setLogin] = useRecoilState(loginAtom);


    return (


        <header id="header" className="header d-flex align-items-center fixed-top">
            <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

                <a href="/" className="logo d-flex align-items-center">

                    <img id="site-radius-image-logo" src="/img/DaeJangBu-radius-image-nobg-logo.png" alt="" />

                    <h1 className="sitename">Captain Book</h1>
                </a>

                <nav id="navmenu" className="navmenu">
                    <ul>
                        <li><a href="#hero" className="active">Home</a></li>
                        <li><a className="header-a-services" href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        
                        {/* 현재는 이용하지 않아 주석처리함. 나중에 필요한 기능이 생기면 활용하기. */}
                        {/* <li className="dropdown"><a href="#"><span>Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                            <ul>
                                <li><a href="#">Dropdown 1</a></li>
                                <li className="dropdown"><a href="#"><span>Deep Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                                    <ul>
                                        <li><a href="#">Deep Dropdown 1</a></li>
                                        <li><a href="#">Deep Dropdown 2</a></li>
                                        <li><a href="#">Deep Dropdown 3</a></li>
                                        <li><a href="#">Deep Dropdown 4</a></li>
                                        <li><a href="#">Deep Dropdown 5</a></li>
                                    </ul>
                                </li>
                                <li><a href="#">Dropdown 2</a></li>
                                <li><a href="#">Dropdown 3</a></li>
                                <li><a href="#">Dropdown 4</a></li>
                            </ul>
                        </li> */}


                        {!login.isLogin &&
                            <LoginMainBtn loginMainBtnHandlerInRef={loginMainBtnHandlerInRef} />
                        }

                        {login.isLogin &&
                            <UserInfo login={login} />
                        }


                        {login.isLogin &&
                            <LogoutBtn setLogin={setLogin} fetchHandlerInRef={fetchHandlerInRef} />
                        }



                    </ul>

                    <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                </nav>

            </div>
        </header>

    );
}

export default MainHeader;