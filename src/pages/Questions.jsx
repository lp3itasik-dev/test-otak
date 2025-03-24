import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../assets/img/background.png";
import control from "../assets/img/question/control.png";
import planning from "../assets/img/question/planning.png";
import conclution1 from "../assets/img/question/conclutions1.png";
import conclution2 from "../assets/img/question/conclutions2.png";
import sleep from "../assets/img/question/sleep.png";
import dreambig from "../assets/img/question/dream-big.png";
import idea from "../assets/img/question/idea.png";
import art from "../assets/img/question/digital-drawing.png";
import math from "../assets/img/question/math.png";
import people from "../assets/img/question/people.png";
import late from "../assets/img/question/late.png";
import dicipline from "../assets/img/question/discipline.png";
import affraid from "../assets/img/question/affraid.png";
import publicspeaking from "../assets/img/question/public-speaking.png";
import feel from "../assets/img/question/feel.png";
import concept from "../assets/img/question/concept.png";
import file from "../assets/img/question/file.png";
import nofile from "../assets/img/question/nofile.png";
import active from "../assets/img/question/active-learning.png";
import speaking from "../assets/img/question/talking.png";
import love from "../assets/img/question/love.png";
import nolove from "../assets/img/question/no-love.png";
import visual from "../assets/img/question/visual-thinking.png";
import novisual from "../assets/img/question/mindset.png";
import conversation from "../assets/img/question/conversation.png";
import understanding from "../assets/img/question/understanding.png";
import woman from "../assets/img/question/woman.png";
import setting from "../assets/img/question/setting.png";
import puzzel from "../assets/img/question/puzzel.png";
import nogame from "../assets/img/question/no-games.png";
import emotions from "../assets/img/question/emotions.png";
import mask from "../assets/img/question/mask.png";
import fiction from "../assets/img/question/fiction.png";
import romantic from "../assets/img/question/romantic.png";
import systemanalys from "../assets/img/question/systemanalys.png";
import relationproblem from "../assets/img/question/relationproblem.png";
import music from "../assets/img/question/music.png";
import nomusic from "../assets/img/question/no-music.png";
import logoLp3i from "../assets/img/logo-lp3i.png";
import logoTagline from "../assets/img/tagline-warna.png";

import LoadingScreen from './LoadingScreen'
import ServerError from './errors/ServerError'

const Questions = () => {
  const [skorKanan, setSkorKanan] = useState(0);
  const [skorKiri, setSkorKiri] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState({});
  const [selectedOption, setSelectedOption] = useState(() => {
    const savedOption = localStorage.getItem("LP3ITO:selectedOption");
    return savedOption ? JSON.parse(savedOption) : {};
  });
  const [hasil, setHasil] = useState("");


  const [user, setUser] = useState({
    name: 'Loading...'
  });

  const [errorPage, setErrorPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [userid, setUserid] = useState(" ");

  useEffect(() => {
    const storedUserid = localStorage.getItem("userid");

    if (storedUserid !== null) {
      setUserid(storedUserid);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      setUserid(user.id);
    }
  }, [user]);

  const handleOptionSelect = (event) => {
    const { name, value, dataset } = event.target;
    let dataSelect = localStorage.getItem("LP3ITO:selectedOption");
    let bucket = dataSelect ? JSON.parse(dataSelect) : [];

    const data = {
      name,
      value,
      category: dataset.kategori,
      id_user: user.id,
      nama: user.name,
      phone: user.phone,
      sekolah: user.school,
    };

    bucket = bucket.filter((item) => item.name !== name);

    bucket.push(data);
    setIsButtonVisible(bucket.length >= 19);
    setIsButtonDisabled(bucket.length < 19);
    localStorage.setItem("LP3ITO:selectedOption", JSON.stringify(bucket));
  };

  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const mainStyle = {
    position: "relative",
    overflowX: "hidden",
    overflowY: "auto",
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "repeat",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -2,
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(212, 212, 212, 0.5)",
    zIndex: -1,
  };

  const handleSubmit = async (selectedOption) => {
    selectedOption.preventDefault();
    const dataStorage = localStorage.getItem("LP3ITO:selectedOption");
    if (dataStorage) {
      let data = JSON.parse(dataStorage);
      await axios
        .post("https://psikotest-otak-backend.politekniklp3i-tasikmalaya.ac.id/answers", data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      navigate("/result");
    } else {
      alert("Ente belom ngisi!");
    }
  };

  const getInfo = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('LP3ITO:token');
      if (!token) {
        return navigate('/');
      }

      const decoded = jwtDecode(token);
      const fetchProfile = async (token) => {
        const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        const data = {
          id: decoded.data.id,
          name: profileData.applicant.name,
          email: profileData.applicant.email,
          phone: profileData.applicant.phone,
          school: profileData.applicant.school,
          classes: profileData.applicant.class,
          status: decoded.data.status,
        };
        setUser(data);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v2', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ITO:token', newToken);
            const newProfileData = await fetchProfile(newToken);
            const data = {
              id: decodedNewToken.data.id,
              name: newProfileData.applicant.name,
              email: newProfileData.applicant.email,
              phone: newProfileData.applicant.phone,
              school: newProfileData.applicant.school,
              classes: newProfileData.applicant.class,
              status: decodedNewToken.data.status,
            };
            setUser(data);
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3ITO:token');
              navigate('/')
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          localStorage.removeItem('LP3ITO:token');
          setErrorPage(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3ITO:token');
          navigate('/');
        } else {
          console.error('Unexpected HTTP error:', error);
          setErrorPage(true);
        }
      } else if (error.request) {
        console.error('Network error:', error);
        setErrorPage(true);
      } else {
        console.error('Error:', error);
        setErrorPage(true);
      }
      navigate('/');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    const radioButtons = document.querySelectorAll(".radio-button");

    const handleRadioChange = () => {
      let skorKananTotal = 0;
      let skorKiriTotal = 0;

      radioButtons.forEach((radio) => {
        if (radio.checked) {
          const kategori = radio.getAttribute("data-kategori");
          if (kategori === "kiri") {
            skorKiriTotal += parseInt(radio.value);
          } else if (kategori === "kanan") {
            skorKananTotal += parseInt(radio.value);
          }
        }
      });

      setSkorKanan(skorKananTotal);
      setSkorKiri(skorKiriTotal);
      if (skorKananTotal > skorKiriTotal) {
        setHasil("KANAN");
      } else if (skorKananTotal < skorKiriTotal) {
        setHasil("KIRI");
      } else {
        setHasil("SAMA");
      }
    };
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", handleRadioChange);
    });

    return () => {
      radioButtons.forEach((radioButton) => {
        radioButton.removeEventListener("change", handleRadioChange);
      });
    };
  }, []);

  const handleBoxClick = (e) => {
    const radioButton = e.currentTarget.previousElementSibling;
    const name = radioButton.name;
    radioButton.checked = true;
    radioButton.dispatchEvent(new Event("change", { bubbles: true }));

    setSelectedRadio((prevState) => ({
      ...prevState,
      [name]: radioButton.dataset.kategori,
    }));
  };

  const getBoxStyle = (name, kategori) => {
    return selectedRadio[name] === kategori
      ? "w-7 h-7 border-2 border-black bg-blue-500 rounded-full"
      : "w-7 h-7 border-2 border-black hover:bg-black rounded-full";
  };

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main
          style={mainStyle}
          className="flex flex-col p-5 md:p-20 items-center justify-center overflow-y-scroll"
        >
          <div style={backgroundImageStyle}></div>
          <div style={overlayStyle}></div>

          <div className="max-w-md md:mx-auto flex justify-center gap-5 mb-5 mt-10 mx-10">
            <img src={logoLp3i} alt="logo lp3i" className="h-10 md:h-14" />
            <img
              src={logoTagline}
              alt="logo lp3i"
              className="h-10 md:h-14"
              data-aos-delay="100"
            />
          </div>

          <div className="w-full mb-12 flex text-center items-center justify-center font-bold text-xl md:text-2xl">
            TEST OTAK KIRI DAN OTAK KANAN
          </div>

          <div
            className="bg-white mb-20 pb-14 md:pb-10 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={planning}
                  alt="Planning"
                  className="w-[150px] md:w-[200px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya menikmati merencanakan hal baru dengan detail</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="satu"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("satu", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={control}
                  alt="Planning"
                  className="w-[180px] md:w-[220px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya menikmati sesuatu yang baru pada kekangan gerakan</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="satu"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("satu", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            data-aos="fade-down"
            data-aos-delay="500"
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center">
                <img
                  src={conclution1}
                  alt="Planning"
                  className="w-[150px] md:w-[200px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya sangat logis dan saya jarang membuat kesimpulan</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="dua"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("dua", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={conclution2}
                  alt="Planning"
                  className="w-[160px] md:w-[200px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya bisa mencapai kesimpulan tanpa mengikuti semua argumen secara
                  mendetail
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="dua"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("dua", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={sleep}
                  alt="Planning"
                  className="w-[150px] md:w-[180px] ml-10 md:ml-0"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya jarang bermimpi siang hari atau mengingat mimpi buruk saya
                  malam hari
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tiga"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tiga", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={dreambig}
                  alt="Planning"
                  className="w-[180px] md:w-[200px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Mimpi saya terlihat begitu jelas dan saya sering bermimpi di siang
                  hari
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tiga"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tiga", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center">
                <img src={idea} alt="Planning" className="w-[180px] md:w-[200px]" />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya berusaha menemukan alasan dari perilaku orang lain</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="empat"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("empat", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={people}
                  alt="Planning"
                  className="w-[180px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya sering melihat motivasi terpendam dari perilaku orang lain
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="empat"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("empat", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img src={math} alt="Planning" className="w-[135px] md:w-[190px]" />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya lebih memilih matematika dan masalah ilmiah daripada masalah
                  seni
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="lima"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("lima", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={art}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya memilih masalah seni dari pada matematika dan ilmiah</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="lima"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("lima", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* 5 */}
          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={dicipline}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya tepat waktu dan sangat menghargai waktu</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="enam"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("enam", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={late}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya tidak begitu memperhatikan waktu dan saya tidak begitu
                  menghargai waktu
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="enam"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("enam", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={publicspeaking}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya sangat bagus dalam menjelaskan masalah melalui kata-kata
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tujuh"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tujuh", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={affraid}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya mengalami kesulitan menjelaskan sesuatu melalui kata-kata
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tujuh"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tujuh", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={concept}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya tergantung pada bukti saat saya membuat keputusan</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="delapan"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("delapan", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={feel}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya tergantung pada perasaan saat membuat keputusan</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="delapan"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("delapan", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img src={file} alt="Planning" className="w-[135px] md:w-[190px]" />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>File dan materi referensi saya tersusun dengan rapi</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sembilan"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sembilan", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={nofile}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya jarang menggunakan file terhadap sesuatu</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sembilan"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sembilan", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={speaking}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya selalu menjaga tangan saya saat berbicara</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sepuluh"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sepuluh", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={active}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya banyak bergerak saat bicara</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sepuluh"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sepuluh", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* 5 */}

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={nolove}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya jarang berfirasat dan memilih untuk tidak mengikuti kata hati
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sebelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sebelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={love}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya bergantung pada naluri dan mengikuti kata hati saya</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sebelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sebelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={visual}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya jarang berpikir dengan visual</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="duabelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("duabelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={novisual}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Impresi dan pikiran saya sering muncul dalam gambar</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="duabelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("duabelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={conversation}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya sangat bagus dalam menjelaskan sesuatu</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tigabelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tigabelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={understanding}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya bisa mengerti apa yang dimaksud oleh orang lain tanpa tahu
                  bagaimana menjelaskannya.
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tigabelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tigabelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={woman}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya memecahkan masalah dengan terus berusaha melakukan pendekatan
                  lain sampai-sampai saya menemukan jalan keluar
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="empatbelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("empatbelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={setting}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya memecahkan masalah dengan menaruhnya pada bagian belakang
                  pikiran saya dan menunggu jalan keluar itu muncul
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="empatbelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("empatbelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={puzzel}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya sangat bagus bermain teka-teki dan permainan kata-kata
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="limabelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("limabelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={nogame}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya sama sekali tidak bisa menikmati teka-teki dan permainan
                  kata-kata
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="limabelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("limabelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* 5 */}

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={emotions}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya mengontrol perasaan saya dengan baik</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="enambelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("enambelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={mask}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya membiarkan pertunjukan perasaan saya</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="enambelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("enambelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={fiction}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya lebih suka membaca non fiksi dari pada novel</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tujuhbelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tujuhbelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={romantic}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>
                  Saya lebih sering memilih membaca novel romantis daripada non
                  fiksi
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="tujuhbelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("tujuhbelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-20 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={systemanalys}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya menganalisa masalah</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="delapanbelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("delapanbelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={relationproblem}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya berhubungan dengan masalah secara keseluruhan</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="delapanbelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("delapanbelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white mb-10 pb-14 p-10 shadow-lg rounded-3xl w-full mx-20 flex flex-col md:flex-row md:flex gap-20 items-center justify-center animate-slide-down"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={nomusic}
                  alt="Planning"
                  className="w-[135px] md:w-[190px]"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya tidak terlalu menyukai musik</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sembilanbelas"
                      value="1"
                      data-kategori="kiri"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sembilanbelas", "kiri")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="gap-5 items-center justify-center md:w-[500px]">
              <div className="flex items-center justify-center -mt-10 md:mt-0">
                <img
                  src={music}
                  alt="Planning"
                  className="w-[135px] md:w-[190px] mb-4"
                />
              </div>
              <div className="flex gap-5 border-2 border-black px-3 p-4 rounded-md md:rounded-full items-center justify-center">
                <div>Saya sangat menyenangi musik</div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="sembilanbelas"
                      value="1"
                      data-kategori="kanan"
                      className="radio-button hidden"
                      onClick={handleOptionSelect}
                    />
                    <div
                      className={getBoxStyle("sembilanbelas", "kanan")}
                      onClick={handleBoxClick}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} method="post" id="nameForm">
            <div className="hidden">
              <div className="flex">
                User Id
                <input
                  type="number"
                  id="user_id"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex">
                Kanan
                <input type="number" id="skor_kanan" value={skorKanan} readOnly />
              </div>
              <div className="flex">
                Kiri
                <input type="number" id="skor_kiri" value={skorKiri} readOnly />
              </div>
              <div className="flex">
                Hasil
                <input type="text" id="hasil" value={hasil} readOnly />
              </div>
            </div>
            <button
              style={{ display: isButtonVisible ? "flex" : "none" }}
              className="bg-white p-4 w-28 flex items-center justify-center font-bold border-2 border-black hover:bg-black hover:text-white"
              type="submit"
              disabled={isButtonDisabled}
            >
              HASIL
            </button>
          </form>
        </main>
      )
    )
  );
};

export default Questions;
