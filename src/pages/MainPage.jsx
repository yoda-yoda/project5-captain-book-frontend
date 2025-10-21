import { useRef } from "react";
import PortfolioSection from "../components/PortfolioSection";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import HeroSection from "../components/HeroSection";


function MainPage({ loginMainBtnHandlerInRef, fetchHandlerInRef }) {


    // 콜백 레지스트리(handlerRef) 방식을 활용하기 위한 useRef 이다.
    // 이 방식을 이용하면 DOM을 직접 추출할 필요가 없고,
    // ref의 current값에 콜백 함수 자체를 담아 함수 참조를 형제 컴포넌트끼리도 공유할 수 있다.
    const startBtnHandlerInRef = useRef(() => { });

    return (

        <main className="main">

            <HeroSection startBtnHandlerInRef={startBtnHandlerInRef} />
            <ServicesSection startBtnHandlerInRef={startBtnHandlerInRef} loginMainBtnHandlerInRef={loginMainBtnHandlerInRef} fetchHandlerInRef={fetchHandlerInRef} />
            <AboutSection />
            <StatsSection />
            <PortfolioSection />

        </main>

    )
}

export default MainPage;