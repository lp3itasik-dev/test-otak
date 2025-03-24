/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Lottie from "lottie-react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import awanLp3i from "../assets/img/awan-lp3i.json";
import logoLp3i from "../assets/img/logo-lp3i.png";
import logoTagline from "../assets/img/tagline-warna.png";

import LoadingScreen from './LoadingScreen'
import ServerError from './errors/ServerError'

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });

  const [errorPage, setErrorPage] = useState(false);
  const [result, setResult] = useState(null);
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
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
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
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  };

  const logoutHandle = async () => {
    const confirmed = confirm('Apakah anda yakin akan keluar?');
    if (confirmed) {
      try {
        const token = localStorage.getItem('LP3ITO:token');
        const responseData = await axios.delete('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/logout/v2', {
          headers: {
            Authorization: token
          }
        });
        if (responseData) {
          alert(responseData.data.message);
          localStorage.removeItem('LP3ITO:token');
          localStorage.removeItem('LP3ITO:selectedOption');
          navigate('/')
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v2', {
              withCredentials: true,
            });

            const newToken = response.data;
            const responseData = await axios.delete('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/logout/v2', {
              headers: {
                Authorization: newToken
              }
            });
            if (responseData) {
              alert(responseData.data.message);
              localStorage.removeItem('LP3ITO:token');
              localStorage.removeItem('LP3ITO:selectedOption');
              navigate('/')
            }
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3ITO:token');
              navigate('/')
            }
            if (error.response && error.response.status === 401) {
              localStorage.removeItem('LP3ITO:token');
              navigate('/')
            }
          }
        } else {
          console.error('Error fetching profile:', error);
          setErrorPage(true);
        }
      }
    }
  }

  const startTest = async () => {
    setLoading(true);
    try {
      const responseUserExist = await axios.get(
        `https://psikotest-otak-backend.politekniklp3i-tasikmalaya.ac.id/users/${user.id}`
      );
      if (responseUserExist.data) {
        navigate("/question");
      } else {
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
              id_user: decoded.data.id,
              name: profileData.applicant.name,
              email: profileData.applicant.email,
              phone: profileData.applicant.phone,
              school: profileData.applicant.school,
              classes: profileData.applicant.class,
              status: decoded.data.status,
            };
            setUser(data);
            const responseUser = await axios.post(`https://psikotest-otak-backend.politekniklp3i-tasikmalaya.ac.id/users`, data);
            if (responseUser) {
              setTimeout(() => {
                setLoading(false);
              }, 1000);
              navigate("/question");
            }
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
                  id_user: decodedNewToken.data.id,
                  name: newProfileData.applicant.name,
                  email: newProfileData.applicant.email,
                  phone: newProfileData.applicant.phone,
                  school: newProfileData.applicant.school,
                  classes: newProfileData.applicant.class,
                  status: decodedNewToken.data.status,
                };
                setUser(data);
                const responseUser = await axios.post(`https://psikotest-otak-backend.politekniklp3i-tasikmalaya.ac.id/users`, data);
                console.log(responseUser);
                if (responseUser) {
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                  navigate("/question");
                }
              } catch (error) {
                console.error('Error refreshing token or fetching profile:', error);
                if (error.response && error.response.status === 400) {
                  localStorage.removeItem('LP3ITO:token');
                  navigate('/');
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
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <section className="bg-white h-screen relative bg-cover">
          <main className="container mx-auto flex flex-col justify-center items-center h-screen px-5 gap-5">
            <div className="flex justify-between gap-5">
              <img src={logoLp3i} alt="logo lp3i" className="h-14" />
              <img src={logoTagline} alt="logo lp3i" className="h-12" />
            </div>
            <Lottie animationData={awanLp3i} loop={true} className="h-52" />
            <div className="text-center space-y-2">
              <h2 className="uppercase font-bold text-3xl">Tes Otak Kanan Kiri</h2>
              <p className="text-sm">
                Puncak kebahagiaan dan kesuksesan tercapai saat kita memanfaatkan
                kecerdasan otak kanan dan kiri secara optimal.
                <br></br>
                Fokuslah pada pembelajaran dan pekerjaan yang sesuai dengan kekuatan
                alami otak kita.
                <br></br>
                Dengan begitu, kita membuka pintu menuju pencapaian dan kebahagiaan
                yang tak terbatas.
              </p>
            </div>
            {loading ? (
              <p className="text-gray-900 text-sm">Loading...</p>
            ) : errorPage ? (
              <div className="text-center space-y-3">
                <div className="border-2 border-red-500 text-base bg-red-500 rounded-xl text-white px-5 py-3">
                  <p>Mohon maaf, server sedang tidak tersedia.</p>
                </div>
                <button
                  type="button"
                  onClick={logoutHandle}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Keluar
                </button>
              </div>
            ) : result.length > 0 ? (
              <div className="text-center space-y-3">
                <div className="border-2 border-gray-900 text-base px-5 py-3">
                  <p>
                    <span>Nama Lengkap: </span>
                    <span className="font-bold underline">{user.name}</span>
                  </p>
                  <p>
                    <span>Dominan: </span>
                    <span className="font-bold underline">
                      <span className="uppercase">{result[0].hasil}</span>
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logoutHandle}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startTest}
                className="border-2 border-gray-900 text-sm uppercase font-bold hover:bg-gray-900 hover:text-white px-3 py-1"
              >
                <span>Mulai</span>
              </button>
            )}
          </main>
        </section>
      )
    )
  );
}

export default Home;
