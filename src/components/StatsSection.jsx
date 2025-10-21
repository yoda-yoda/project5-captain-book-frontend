
function StatsSection() {

    return (

        // < !--Stats Section-- >
        <section id="stats" className="stats section light-background">

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                <div className="row gy-4">

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="100" data-purecounter-duration="1" className="purecounter"></span>
                            <p>목표 자산(억)</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="5" data-purecounter-duration="1" className="purecounter"></span>
                            <p>현재 프로젝트</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="1000" data-purecounter-duration="1" className="purecounter"></span>
                            <p>목표 프로젝트</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="75" data-purecounter-duration="1" className="purecounter"></span>
                            <p>현재 트러블슈팅</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}
                </div>
            </div>

        </section>
        // <!-- /Stats Section -->

    );
}

export default StatsSection;