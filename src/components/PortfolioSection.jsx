import "../styles/PortfolioSection.css"


function PortfolioSection() {
    return (


        <section id="portfolio" className="portfolio">

            <div className="container section-title" data-aos="fade-up">
                <h2> 포트폴리오 정보 </h2>
            </div>



            <div className="container">

                <div className="row gy-4">

                    <div className="container portfolio-info-list" data-aos="fade-up">

                            <a href="/portfolio.html?file=troubleShooting.md" target="_blank"
                                rel="noopener noreferrer" className="trouble-shooting-btn">
                                <span id="trouble-shooting-btn-span">1. 트러블슈팅 목록 (새 페이지 열기) </span>
                            </a>


                            <a href="/portfolio.html?file=troubleShooting.md" target="_blank"
                                rel="noopener noreferrer" className="trouble-shooting-btn">
                                <span id="trouble-shooting-btn-span">1. 트러블슈팅 목록 (새 페이지 열기) </span>
                            </a>

                            

                    </div>
                </div>

            </div>

        </section>



    )
}

export default PortfolioSection;
