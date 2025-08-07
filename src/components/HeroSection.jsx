import StartBtn from "../components/StartBtn";

function HeroSection({startBtnHandlerInRef}) {


    return (

        /* <!-- Hero Section --> */
        <section id="hero" className="hero section dark-background">

            <img src="img/hero-bg.jpg" alt="" data-aos="fade-in" />

            <div className="container text-center" data-aos="fade-up" data-aos-delay="100">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h2>Welcome to Our Website</h2>
                        <p>We are team of talented designers making websites with Bootstrap</p>
                        <StartBtn startBtnHandlerInRef={startBtnHandlerInRef}/>
                    </div>
                </div>
            </div>

        </section>
        /* <!-- /Hero Section --> */ 

    

    );
}

export default HeroSection;