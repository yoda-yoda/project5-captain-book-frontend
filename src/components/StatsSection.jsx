

function StatsSection() {

    return (

        // < !--Stats Section-- >
        <section id="stats" className="stats section light-background">

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                <div className="row gy-4">

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="232" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Clients</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="521" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Projects</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="1453" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Hours Of Support</p>
                        </div>
                    </div>
                    {/* <!-- End Stats Item --> */}

                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="32" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Workers</p>
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