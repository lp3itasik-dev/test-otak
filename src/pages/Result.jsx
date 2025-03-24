import axios from "axios";
import Lottie from "lottie-react";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../assets/img/background.png";
import questionImage from "../assets/img/awan-lp3i.json";

import LoadingScreen from './LoadingScreen'
import ServerError from './errors/ServerError'

const Result = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const [errorPage, setErrorPage] = useState(false);
  const [loading, setLoading] = useState(true);

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
        getResult(data);
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
            getResult(data);
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

  const getResult = async (data) => {
    await axios
      .get(`https://psikotest-otak-backend.politekniklp3i-tasikmalaya.ac.id/hasils/${data.id}`)
      .then((response) => {
        const data = response.data;

        if (data.length == 0) {
          return navigate("/home");
        }
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logoutFunc = () => {
    localStorage.removeItem("LP3ITO:token");
    localStorage.removeItem("LP3ITO:selectedOption");
    navigate("/");
  };

  useEffect(() => {
    getInfo();
  }, []);

  const mainStyle = {
    position: "relative",
    overflowX: "hidden", // Prevent horizontal scrolling
    overflowY: "auto", // Allow vertical scrolling if needed
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
  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main
          style={mainStyle}
          className="flex flex-col p-5 md:p-20 items-center justify-center h-screen"
        >
          <div style={backgroundImageStyle}></div>
          <div style={overlayStyle}></div>
          <Lottie animationData={questionImage} loop={true} className="h-40" />
          <div className="bg-white shadow-xl p-4 text-center rounded-3xl">
            <div className="font-bold text-[30px] my-2">{user.name}</div>
            <hr className="border boreder-2 my-4 mx-4" />

            {result ? (
              <div className="text-2xl text-black uppercase font-bold" id="result">
                {result[0].hasil === "kanan" ? (
                  <div className="p-4 normal-case text-md text-sm text-slate-700">
                    Selamat, kamu dominan{" "}
                    <span className="text-red-500 font-extrabold uppercase">
                      otak kanan
                    </span>
                    ! Kreativitas dan imajinasi yang tinggi adalah kekuatanmu.
                  </div>
                ) : result[0].hasil === "kiri" ? (
                  <div className="p-4 normal-case text-md text-sm text-slate-700">
                    Selamat, kamu dominan <span className="text-red-500 font-extrabold uppercase">
                      otak kiri
                    </span>! Kemampuan analitis dan logikamu
                    sangat luar biasa.
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-black">Loading..</p>
            )}
            <button
              type="button"
              onClick={logoutFunc}
              className="bg-sky-700 hover:bg-sky-800 text-white px-5 py-2 rounded-xl text-sm"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Keluar
            </button>
          </div>
        </main>
      )
    )
  );
};

export default Result;
