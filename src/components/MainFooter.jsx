import "../styles/MainFooter.css"

function MainFooter() {

    return (

        <footer id="footer" className="footer dark-background">
            <div className="container">

                <div className="footer-logo-title">
                    <img id="footer-radius-logo" src="/img/DaeJangBu-radius-logo.png" alt="" />
                    <h3 className="sitename">Captain Book</h3>
                </div>

                <p>It makes starting your account book simple and convenient.</p>
                <div className="social-links d-flex justify-content-center">
                    <a href=""><i className="bi bi-twitter-x"></i></a>
                    <a href=""><i className="bi bi-facebook"></i></a>
                    <a href=""><i className="bi bi-instagram"></i></a>
                    <a href=""><i className="bi bi-skype"></i></a>
                    <a href=""><i className="bi bi-linkedin"></i></a>
                </div>
                <div className="container">
                    <div className="copyright">
                        <span>웹 애플리케이션</span> <strong className="px-1 sitename">대장부</strong> <span>방문해주셔서 감사합니다.</span>
                    </div>
                    <div className="credits">
                        {/* <!-- All the links in the footer should remain intact. -->
          <!-- You can delete the links only if you've purchased the pro version. -->
          <!-- Licensing information: https://bootstrapmade.com/license/ -->
          <!-- Purchase the pro version with working PHP/AJAX contact form: [buy-url] --> */}
                        Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default MainFooter;