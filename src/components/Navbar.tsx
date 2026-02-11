import { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import logo from "/image/logo/logo-monalisa.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAuthHooks from '../hooks/AuthHooks';
import { BASE_URL_FILE } from '../server/API';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLaporanOpen, setIsLaporanOpen] = useState<boolean>(false);
  const [isHasilOpen, setIsHasilOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { handleLogout } = useAuthHooks();
  const type = user ? user.role.name : 'guest';

  const ppkLaporanItems = [
    { label: 'Rencana Anggaran', path: '/ppk/rencana-anggaran' },
    { label: 'Jadwal Pelaksanaan', path: '/ppk/jadwal-pelaksanaan' },
    { label: 'Realisasi Pekerjaan', path: '/ppk/realisasi-pekerjaan' },
    { label: 'Project Progress (Kurva S)', path: '/ppk/project-kurva-s' }
  ];

  const pokjaLaporanItems = [
    { label: 'Data Entry Penjabat Pengadaan', path: '/pokja/data-entry-penjabat-pengadaan' },
    { label: 'Data Entry Kelompok Kerja', path: '/pokja/data-entry-kelompok-kerja' },
  ];

  const pokjaHasilItems = [
    { label: 'Penjabat Pengadaan', path: '/pokja/penjabat-pengadaan' },
    { label: 'Kelompok Kerja', path: '/pokja/kelompok-kerja' },
  ];

  const kepalaLaporanItems = [
    { label: 'Rencana Anggaran', path: '/kepala/rencana-anggaran' },
    { label: 'Jadwal Pelaksanaan', path: '/kepala/jadwal-pelaksanaan' },
    { label: 'Realisasi Pekerjaan', path: '/kepala/realisasi-pekerjaan' },
    { label: 'Project Progress (Kurva S)', path: '/kepala/project-kurva-s' }
  ];

  const kepalaHasilItems = [
    { label: 'Penjabat Pengadaan', path: '/kepala/penjabat-pengadaan' },
    { label: 'Kelompok Kerja', path: '/kepala/kelompok-kerja' },
  ];

  const adminItems = [
    { label: 'Manajemen Pengguna', path: '/admin/manajemen-pengguna' },
    { label: 'Kelompok Kerja', path: '/admin/kelompok-kerja' },
  ];

  if (loading) {
    return;
  }

  return (
    <nav className={`w-full px-4 md:px-8 shadow-lg fixed top-0 left-0 right-0 z-50 bg-white ${type == 'guest' ? 'py-3 md:py-6' : 'py-2 md:py-2'}`}>
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <img onClick={() => navigate("/")} src={logo} className="w-auto h-6 cursor-pointer" />

          {type === 'ppk' && (
            <div className="hidden md:flex items-center gap-2">
              <button
                className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10"
                onClick={() => navigate("/")}
              >
                Dashboard
              </button>

              <div className="relative">
                <button
                  className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-2"
                  onClick={() => setIsLaporanOpen(!isLaporanOpen)}
                >
                  Laporan Saya
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLaporanOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {ppkLaporanItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full font-poppins-regular text-left font-poppins text-sm px-6 py-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setIsLaporanOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'pokja/pp' && (
            <div className="hidden md:flex items-center gap-2">
              <button
                className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10"
                onClick={() => navigate("/")}
              >
                Dashboard
              </button>

              <div className="relative">
                <button
                  className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-2"
                  onClick={() => {
                    setIsLaporanOpen(!isLaporanOpen)
                    setIsHasilOpen(false)
                  }}
                >
                  Laporan Saya
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLaporanOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {pokjaLaporanItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full font-poppins-regular text-left font-poppins text-sm px-6 py-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setIsLaporanOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-2"
                  onClick={() => {
                    setIsLaporanOpen(false)
                    setIsHasilOpen(!isHasilOpen)
                  }}
                >
                  Laporan Hasil Pemilihan
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHasilOpen ? 'rotate-180' : ''}`} />
                </button>

                {isHasilOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {pokjaHasilItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full font-poppins-regular text-left font-poppins text-sm px-6 py-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setIsHasilOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {(type === 'kepala bagian'  || type === 'kepala biro') && (
            <div className="hidden md:flex items-center gap-2">
              <button
                className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10"
                onClick={() => navigate("/")}
              >
                Dashboard
              </button>

              <div className="relative">
                <button
                  className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-2"
                  onClick={() => {
                    setIsLaporanOpen(!isLaporanOpen)
                    setIsHasilOpen(false)
                  }}
                >
                  Laporan Saya
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLaporanOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {kepalaLaporanItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full font-poppins-regular text-left font-poppins text-sm px-6 py-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setIsLaporanOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-2"
                  onClick={() => {
                    setIsLaporanOpen(false)
                    setIsHasilOpen(!isHasilOpen)
                  }}
                >
                  Laporan Hasil Pemilihan
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHasilOpen ? 'rotate-180' : ''}`} />
                </button>

                {isHasilOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {kepalaHasilItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full font-poppins-regular text-left font-poppins text-sm px-6 py-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setIsHasilOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'admin' && (
            <div className="hidden md:flex items-center gap-2">
              <button
                className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10"
                onClick={() => navigate("/")}
              >
                Dashboard
              </button>

              <div className="relative">
                <button
                  className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-2"
                  onClick={() => {
                    setIsLaporanOpen(!isLaporanOpen)
                    setIsHasilOpen(false)
                  }}
                >
                  Manajemen
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLaporanOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    {adminItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full font-poppins-regular text-left font-poppins text-sm px-6 py-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setIsLaporanOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {type === 'guest' && (
          <>
            <div className="hidden md:flex items-center">
              <button
                className="font-poppins-medium text-black hover:text-primary text-sm md:text-base px-4 md:px-6 transition-colors duration-200 rounded-t-lg cursor-pointer"
                onClick={() => navigate("/masuk")}
              >
                Masuk
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-10 w-10 text-primary bg-primary/20 p-2 rounded-lg" />
              ) : (
                <Menu className="h-10 w-10 text-primary bg-primary/20 p-2 rounded-lg" />
              )}
            </button>
          </>
        )}

        {type !== 'guest' && (
          <>
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${user?.file_photo ? '' : 'bg-primary/20'} flex items-center justify-center`}>
                      {user?.file_photo ? (
                        <img className='rounded-full w-10 h-10 object-cover' src={`${BASE_URL_FILE}/${user.file_photo}`} alt="" /> 
                      ) : (
                        <span className="font-poppins-medium text-primary text-sm">
                          {user?.fullname.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <span className="font-poppins-medium text-black text-sm">{user?.fullname}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-black transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="">
                      <button
                        className="w-full text-left font-poppins text-sm px-6 py-3 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer flex items-center gap-3"
                        onClick={() => {
                          navigate("/ubah-profile")
                          setIsProfileOpen(false);
                        }}
                      >
                        <User className="h-4 w-4" />
                        Ubah Profile
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="w-full text-left font-poppins text-sm px-6 py-3 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer flex items-center gap-3"
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-10 w-10 text-primary bg-primary/20 p-2 rounded-lg" />
              ) : (
                <Menu className="h-10 w-10 text-primary bg-primary/20 p-2 rounded-lg" />
              )}
            </button>
          </>
        )}
      </div>

      {type === 'guest' && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <button
            className="w-full text-left font-poppins-medium text-base px-4 py-3 mt-2 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20"
            onClick={() => navigate("/masuk")}
          >
            Masuk
          </button>
        </div>
      )}

      {type === 'ppk' && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="mt-4 space-y-2">
            <button
              className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Dashboard
            </button>

            <div>
              <button
                className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20 flex items-center justify-between"
                onClick={() => setIsLaporanOpen(!isLaporanOpen)}
              >
                Laporan Saya
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ml-4
                  ${isLaporanOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {ppkLaporanItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left font-poppins text-sm px-4 py-2.5 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsLaporanOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-full ${user?.file_photo ? '' : 'bg-primary/20'} flex items-center justify-center`}>
                  {user?.file_photo ? (
                    <img className='rounded-full w-10 h-10 object-cover' src={`${BASE_URL_FILE}/${user.file_photo}`} alt="" /> 
                  ) : (
                    <span className="font-poppins-medium text-primary text-sm">
                      {user?.fullname.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                <span className="font-poppins-medium text-black text-sm">{user?.fullname}</span>
              </div>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10 flex items-center gap-3"
                onClick={() => {
                  navigate('/ubah-profile');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </button>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-red-600 cursor-pointer hover:bg-red-50 flex items-center gap-3"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {type === 'pokja/pp' && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="mt-4 space-y-2">
            <button
              className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Dashboard
            </button>

            <div>
              <button
                className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20 flex items-center justify-between"
                onClick={() => setIsLaporanOpen(!isLaporanOpen)}
              >
                Laporan Saya
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ml-4
                  ${isLaporanOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {pokjaLaporanItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left font-poppins text-sm px-4 py-2.5 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsLaporanOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20 flex items-center justify-between"
                onClick={() => setIsHasilOpen(!isHasilOpen)}
              >
                Laporan Hasil Pemilihan
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHasilOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ml-4
                  ${isHasilOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {pokjaHasilItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left font-poppins text-sm px-4 py-2.5 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsLaporanOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-full ${user?.file_photo ? '' : 'bg-primary/20'} flex items-center justify-center`}>
                  {user?.file_photo ? (
                    <img className='rounded-full w-10 h-10 object-cover' src={`${BASE_URL_FILE}/${user.file_photo}`} alt="" /> 
                  ) : (
                    <span className="font-poppins-medium text-primary text-sm">
                      {user?.fullname.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                <span className="font-poppins-medium text-black text-sm">{user?.fullname}</span>
              </div>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10 flex items-center gap-3"
                onClick={() => {
                  navigate('/ubah-profile');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </button>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-red-600 cursor-pointer hover:bg-red-50 flex items-center gap-3"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {(type === 'kepala bagian'  || type === 'kepala biro') && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="mt-4 space-y-2">
            <button
              className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Dashboard
            </button>

            <div>
              <button
                className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20 flex items-center justify-between"
                onClick={() => setIsLaporanOpen(!isLaporanOpen)}
              >
                Laporan Saya
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ml-4
                  ${isLaporanOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {kepalaLaporanItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left font-poppins text-sm px-4 py-2.5 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsLaporanOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20 flex items-center justify-between"
                onClick={() => setIsHasilOpen(!isHasilOpen)}
              >
                Laporan Hasil Pemilihan
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHasilOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ml-4
                  ${isHasilOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {kepalaHasilItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left font-poppins text-sm px-4 py-2.5 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsLaporanOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-full ${user?.file_photo ? '' : 'bg-primary/20'} flex items-center justify-center`}>
                  {user?.file_photo ? (
                    <img className='rounded-full w-10 h-10 object-cover' src={`${BASE_URL_FILE}/${user.file_photo}`} alt="" /> 
                  ) : (
                    <span className="font-poppins-medium text-primary text-sm">
                      {user?.fullname.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                <span className="font-poppins-medium text-black text-sm">{user?.fullname}</span>
              </div>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10 flex items-center gap-3"
                onClick={() => {
                  navigate('/ubah-profile');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </button>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-red-600 cursor-pointer hover:bg-red-50 flex items-center gap-3"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {type === 'admin' && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="mt-4 space-y-2">
            <button
              className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Dashboard
            </button>

            <div>
              <button
                className="w-full text-left font-poppins-medium text-base px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/20 flex items-center justify-between"
                onClick={() => setIsLaporanOpen(!isLaporanOpen)}
              >
                Manajemen Pengguna
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ml-4
                  ${isLaporanOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {adminItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left font-poppins text-sm px-4 py-2.5 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsLaporanOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-full ${user?.file_photo ? '' : 'bg-primary/20'} flex items-center justify-center`}>
                  {user?.file_photo ? (
                    <img className='rounded-full w-10 h-10 object-cover' src={`${BASE_URL_FILE}/${user.file_photo}`} alt="" /> 
                  ) : (
                    <span className="font-poppins-medium text-primary text-sm">
                      {user?.fullname.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                <span className="font-poppins-medium text-black text-sm">{user?.fullname}</span>
              </div>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-black cursor-pointer hover:text-primary hover:bg-primary/10 flex items-center gap-3"
                onClick={() => {
                  navigate('/ubah-profile');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </button>

              <button
                className="w-full text-left font-poppins-regular text-sm px-4 py-3 rounded-lg transition-all duration-200 text-red-600 cursor-pointer hover:bg-red-50 flex items-center gap-3"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}