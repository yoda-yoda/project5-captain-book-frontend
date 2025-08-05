import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CalendarHome from "../pages/CalendarHome.jsx";

function ServicesSection() {

 console.log("set 호출");

  const navigator = useNavigate();
  const location = useLocation();

  const initialData = {
    calendarResponseDtoList: [],
    calendarTotalSum: 0
  };


  const handleOnClick = async function (id) {
    navigator(`/calendar/${id}/item`);
    
    const url = location.pathname;
    
    await requestHandler(url)

    setRender((render) => render + 1);
  };

 

  const [data, setData] = useState(initialData);
  console.log("data", data);
  const [render, setRender] = useState(0);


  async function requestHandler(url) {

    try {
      const res = await fetch(url)
      const resJson = await res.json()
      if (!res.ok) {
        throw new Error(`[서버 오류] 상태 코드: ${resJson.status}, 메시지: ${resJson.message}`)
      }
      setData(resJson)
    }

    catch (error) {
      console.error(error);
      return;
    }

  }


  useEffect(
    () => {
      const startBtn = document.querySelector('.btn-get-started');
      const aTag = document.querySelector('.header-a-services');
      startBtn.addEventListener('click', requestHandler('/home'));
      aTag.addEventListener('click', requestHandler('/home'));

      return () => {
        startBtn.removeEventListener('click', requestHandler);
        aTag.removeEventListener('click', requestHandler);
      }
    }

    , []);


  return (

    // <!-- Services Section -->
    <section id="services" className="services section">


      {/* <!-- Section Title --> */}
      <div className="container section-title" data-aos="fade-up">
        <h2> 달력 </h2>
        <p>Let's gilit</p>
      </div>


      {/* <!-- End Section Title --> */}

      <div className="container">
        <div className="row gy-4">

          <div className="container contents">


            <CalendarHome data={data} handleOnClick={handleOnClick} />
            {/* {location.pathname === `/calendar/${id}/item` &&
             <CalendarHome calendarResponseDtoList={data.calendarResponseDtoList} calendarTotalSum={data.calendarTotalSum} />}
            */}


          </div>

        </div>
      </div>

    </section>
    // <!-- /Services Section -->

  );

}

export default ServicesSection;