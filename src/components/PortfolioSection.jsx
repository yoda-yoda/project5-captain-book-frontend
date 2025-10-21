import "../styles/PortfolioSection.css"


function PortfolioSection() {
    return (


        <section id="portfolio" className="portfolio">

            <div className="container">

                <div className="row gy-4">

                    <div className="container portfolio-info-list" data-aos="fade-up" data-aos-delay="300">

                        <div className="container section-title" >
                            <h2> 포트폴리오 정보 </h2>
                        </div>

                        <a href="/portfolio.html?file=troubleShooting.md" target="_blank"
                            rel="noopener noreferrer" className="trouble-shooting-btn">
                            <span id="trouble-shooting-btn-span"> 트러블슈팅 목록 (새 탭 열기) </span>
                        </a>


                    </div>
                </div>

            </div>

        </section>



    )
}

export default PortfolioSection;
