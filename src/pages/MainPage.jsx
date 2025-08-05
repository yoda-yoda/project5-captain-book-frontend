import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import ServicesSection from "../components/ServicesSection";


function MainPage() {

    return (

        
        <main className="main">
            <HeroSection/>
            <ServicesSection/>
            <AboutSection/>
            <StatsSection/>
        </main>

    )
}

export default MainPage;