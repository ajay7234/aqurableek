import React, { useState } from "react";
import { Login } from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import AprableekLogo from "../../assets/Images/aqrableek-logo-white.jpg";
import PP66title from "../../assets/Images/PP66.png";
import Screenshort1 from "../../assets/Images/screen1.jpg";
import Screenshort2 from "../../assets/Images/screen2.jpg";
import Screenshort3 from "../../assets/Images/screen3.jpg";
import Pic1 from "../../assets/Images/pic1.png";
import Pic2 from "../../assets/Images/pic2.png";
import Content from "../../assets/Images/content.png";
import WeddingCouple from "../../assets/Images/wedding-couple.png";
import GooglePlay from "../../assets/Images/google.png";
import FaceBookImg from "../../assets/Images/facebook.png";
import MailImg from "../../assets/Images/gmail.png";
import TwitterImg from "../../assets/Images/twitter.png";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        {/* <Helmet>
          <meta
            property="og:image"
            content={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6TaCLCqU4K0ieF27ayjl51NmitWaJAh_X0r1rLX4gMvOe0MDaYw&s__META_OG_IMAGE__`}
          />
          <meta
            property="og:url"
            content={`https://aqurableek-5rhg.vercel.app`}
          />
        </Helmet> */}
        <div className="bg-[#f66666] pt-[30px] pb-[15px]">
          <div className="flex justify-center ">
            <button
              onClick={() => navigate("/login")}
              className={
                "text-[#fff] font-semibold p-[6px_16px] rounded-[30px_0_0_30px] border-[1px] border-[#fff]"
              }
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={
                "bg-[#fff] text-[#f66666] font-semibold p-[6px_16px] rounded-[0_30px_30px_0] border-[1px] border-[#fff]"
              }
            >
              Sign Up
            </button>
          </div>
          <div className="flex justify-center pt-[30px]">
            <img
              src={AprableekLogo}
              alt=""
              className="w-[64px] h-[64px] rounded-lg"
            />
          </div>
          <div className="flex justify-center pt-[15px]">
            <img src={PP66title} alt="" className="w-[250px]" />
          </div>
          <div className="text-slate-100 mt-2 text-md text-center">
            تطبيق تواصل اجتماعي يضعك في قلب العوالم الأقرب إليك؛<pre></pre>..
            الوطن، المدينة، الحي السكني، المهنة، المؤسسة <pre></pre>ويقدم خدمات
            مجانية للباحثين عن الزواج أو العمل أو التجارة أو النجاح
          </div>
          {/*{tab === "Log In" && <Login />}
            {tab === "Sign Up" && <SignUp />}*/}
        </div>
        <div className="bg-[#eff6ff] p-[16px]">
          <div className="flex justify-center gap-5 pt-5 flex-row flex-wrap">
            <div className=" p-2  border-2 border-slate-300 rounded-lg">
              <img
                src={Screenshort1}
                alt=""
                className="max-w-[180px] rounded-lg "
              />
            </div>
            <div className=" p-2  border-2 border-slate-300 rounded-lg">
              <img
                src={Screenshort2}
                alt=""
                className="max-w-[180px] rounded-lg"
              />
            </div>
            <div className=" p-2  border-2 border-slate-300 rounded-lg">
              <img
                src={Screenshort3}
                alt=""
                className="max-w-[180px] rounded-lg"
              />
            </div>
          </div>
          <p class="mt-[64px] text-center font-[500] text-lg text-zinc-950">
            تطبيق تواصل اجتماعي محلي فريد من نوعه. يمكنك من التعبير عن آرائك
            وأخبارك لعموم الناطقين بلغتك من خلال مقاطع <pre></pre>مسموعة مسجلة
            قصيرة (15 ثانية). كما يوفر فضاءات مسبقة حرة ومستقلة، هي عبارة عن
            مجموعات وغرف مفتوحة للعموم<pre></pre>وللمتابعين من أجل التواصل
            والنقاش والدردشة، خاصة بكل مدينة صغيرة أو كبيرة. أو التواصل مع
            الأفراد الأقرب إليك من<pre></pre>حيث النشاط المهني (أو الفكري أو
            السياسي أو الروحي أو الرياضي..)،.أو بحسب المؤسسة التعليمية
            (للمتمدرسين)
          </p>
          <div className="p-2 m-[32px_auto] border-2 border-slate-300 rounded-lg sm:w-[540px] w-auto ">
            <img src={Pic1} alt="" className=" rounded-lg" />
          </div>
          <div>
            <div className="p-2 border-2 border-slate-300 rounded-lg w-[150px] m-auto">
              <img src={Content} alt="" className=" rounded-lg" />
            </div>
            <div className="mt-[26px] mb-[48px]">
              <button className="bg-[#f66666] w-[150px] h-[48px] text-slate-100 font-bold text-center flex justify-center items-center flex-col m-auto rounded-md">
                Picstune <span>بيكستون</span>
              </button>
            </div>
            <p class="my-6 text-center font-[500] text-lg text-zinc-950">
              قسم الترفيه في التطبيق، لمشاركة والاستمتاع بأجمل مقاطع أجمل ما
              أبدعه النجوم <pre></pre>المفضلين. وتقاسم مع أعز الناس أجمل
              الذكريات من خلال صور الأرشيف <pre></pre>ومشاهدة وإبداع أجمل
              الأفلام القصيرة جدا
            </p>
          </div>
          <div className="mt-[120px]">
            <div className="p-2 border-2 border-slate-300 rounded-lg w-[150px] m-auto">
              <img src={WeddingCouple} alt="" className=" rounded-lg" />
            </div>
            <div className="mt-[26px] mb-[48px]">
              <button className="bg-[#f66666] w-[154px] h-[48px] text-slate-100 font-bold text-center flex justify-center items-center flex-col m-auto rounded-md">
                Mariages<span> الزواج</span>
              </button>
            </div>
            <p class="my-6 text-center font-[500] text-lg">
              من خلال قسم خاص ومغلق، لا يمكن دخوله أو تصفحه، إلا من طرف الراغبين
              حقا في <pre></pre>الزواج وليس كل المسجلين في التطبيق، وذلك بعد
              عملية تحقق قيد التطوير، وتعبئة جملة <pre></pre>معلومات وشروط،
              يمكنك بعدها البحث والتواصل بالمجان مع شريك حياتك المحتمل
            </p>
          </div>
          <div className="p-2 m-[24px_auto] border-2 border-slate-300 rounded-lg sm:w-[540px] w-auto">
            <img src={Pic2} alt="" className=" rounded-lg" />
          </div>
          <div className="bg-[#fff] rounded-lg">
            <p class="text-lg font-semibold text-center text-[#f66666]">
              :لتحميل التطبيق
            </p>
            <div
              className="w-[150px] m-auto
          "
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.Aqrableek.Aqrableek"
                target="_blank"
                rel="noreferrer"
              >
                <img src={GooglePlay} alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className="bg-[#f66666] pt-[10px] mb-[10px]">
          <p className=" text-center text-slate-50 font-semibold"> :للتواصل</p>
          <div className=" pt-4 pb-8 mx-10 flex flex-row flex-wrap items-center sm:justify-between justify-center">
            <div className=" flex justify-center  items-center  bg-slate-100 rounded-lg border-1 text-red-500 hover:text-slate-50 border-gray-200 hover:bg-red-400 my-2">
              <a
                href="https://www.facebook.com/aqrableek"
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                <div className="flex items-center">
                  <img
                    src={FaceBookImg}
                    alt=""
                    className="w-[45px] h-[45px] p-[3px]"
                  />
                  <span class="font-semibold mx-2">@aqrableek</span>
                </div>
              </a>
            </div>
            <div className="flex justify-center items-center  bg-slate-100 rounded-lg border-1 text-red-500 hover:text-slate-50 border-gray-200 hover:bg-red-400 my-2">
              <a
                href="mailto:aqrableekapp@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center">
                  <img
                    src={MailImg}
                    alt=""
                    className="w-[45px] h-[45px] p-[3px]"
                  />
                  <span class="font-semibold sm:mx-2 mx-0 sm:text-[16px] text-[14px]">
                    aqrableekapp@gmail.com
                  </span>
                </div>
              </a>
            </div>
            <div className="flex justify-center  items-center  bg-slate-100 rounded-lg border-1 text-red-500 hover:text-slate-50 border-gray-200 hover:bg-red-400 my-2">
              <a
                href="https://twitter.com/aqrableek"
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                <div className="flex items-center">
                  <img
                    src={TwitterImg}
                    alt=""
                    className="w-[45px] h-[45px] p-[3px]"
                  />
                  <span class="font-semibold mx-2">@aqrableek</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
