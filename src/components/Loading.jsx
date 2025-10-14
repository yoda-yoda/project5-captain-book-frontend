

function Loading({ navigator }) {


    return (

        <div className="container">
            <div className="row gy-4">
                <div className="container loading-contents">


                    <button onClick={() => navigator("/home")} className="home-btn-container-loading">
                        <i className="bi bi-house-door-fill home-btn" />
                    </button>


                    <div className="loading" data-aos="fade-up">
                        <div className="spinner-border text-dark" role="status" ></div>
                        <br />
                        <span>Loading...</span>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Loading;