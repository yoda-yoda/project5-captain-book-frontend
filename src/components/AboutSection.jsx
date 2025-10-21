import "../styles/AboutSection.css"


function AboutSection() {

    return (

        /* <!-- About Section --> */
        <section id="about" className="about section">

            <div className="container">

                <div className="row gy-4">

                    <div className="col-lg-6 position-relative d-flex align-items-center order-lg-last" data-aos="fade-up" data-aos-delay="200">
                        <img src="/img/DaeJangBu-logo.jpg" className="img-fluid flex-shrink-0" id="about-logo" alt="" />
                        <a href="https://github.com/yoda-yoda?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pulsating-play-btn logo"></a>
                    </div>

                    <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
                        <h3> 대장부 (Captain Book) Project</h3>
                        <p>
                            안녕하세요. 방문해주셔서 감사합니다. <br />
                            이 프로젝트는 가계부를 간단하게 기록하고, 계산하는 웹 애플리케이션 개인 프로젝트 입니다. <br />
                            제목 'Captain Book'은 우리말로 '대장부'를 표현했습니다. <br />
                            '대장부'란 단어는 '무언가를 기록하는 큰 장부', '크고 씩씩한 사람'이라는 뜻을 동시에 담고있습니다.
                            단어 뜻처럼 삶에 든든한 보탬이 되면 좋겠다는 생각이 들었습니다.<br />
                            다음은 이 프로젝트에서 제가 중시한 점들입니다.

                        </p>
                        <ul>
                            <li>
                                <i className="bi bi-person-walking"></i>
                                <div>
                                    <h5> 혼자만의 힘 </h5>
                                    <p> 이 프로젝트의 시작부터 끝까지 모든 과정을 최대한 혼자만의 힘으로 해결하였습니다. <br />
                                        검색과 Ai를 활용하더라도 최대한 문제를 제 스스로 이해하고 해결하려 노력했습니다. <br />
                                        왜냐하면 그 과정이 저를 훈련시킬거라 생각했기 때문입니다. </p>
                                </div>
                            </li>
                            <li>
                                <i className="bi bi-journal-check"></i>
                                <div>
                                    <h5> 원리 이해 중시 </h5>
                                    <p> 프로젝트 중 발생한 모든 궁금증, 문제, 해결은 그 원리를 이해하도록 했습니다. <br />
                                        왜냐하면 이유를 모를땐 불편하기 때문입니다. 따라서 원리를 깊이있게 이해하려 노력했습니다.</p>
                                </div>
                            </li>
                            <li>
                                <i className="bi bi-stack"></i>
                                <div>
                                    <h5> 다양한 기술 훈련 </h5>
                                    <p> 가능하면 다양한 기술이나 까다로운 기술을 접하도록 했습니다. <br /><br />
                                        예를들면 렌더링에 타임리프와 리액트, 로그인에 폼로그인과 OAuth,
                                        데이터베이스에 H2와 MySQL, 시큐리티에 세션 기반/CSRF 토큰과 JWT 등 1가지 기술뿐만 아니라 다양한 기술 모두를 적용해보는 훈련을 했습니다. <br /><br />
                                        리액트에서는 더 편리하다는 axios 라이브러리를 일부러 사용하지 않고 훈련을 위해 fetch만을 활용하였습니다. <br /><br />
                                        왜냐하면 다양하고 더 까다로운 기술을 먼저 접하면 그 이해와 활용의 폭이 더 넓어질거라 생각했기 때문입니다. </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>

        </section>
        /* <!-- /About Section --> */

    );
}

export default AboutSection;