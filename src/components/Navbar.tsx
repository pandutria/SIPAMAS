/* eslint-disable react-hooks/static-components */
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, LogOut, MapPin, LayoutDashboard, FileText } from 'lucide-react';
import logo from "/image/logo/logo-sipamas.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAuthHooks from '../hooks/AuthHooks';
import { BASE_URL_FILE } from '../server/API';

const navConfig: Record<string, { dashboardPath: string; dropdownLabel: string; dropdownItems: { label: string; path: string }[] }> = {
  'super-admin': {
    dashboardPath: '/',
    dropdownLabel: 'Manajemen',
    dropdownItems: [
      { label: 'Pengguna', path: '/superadmin/manajemen-pengguna' },
      { label: 'Laporan', path: '/superadmin/manajemen-laporan' },
    ],
  },
  'masyarakat': {
    dashboardPath: '/',
    dropdownLabel: 'Laporan',
    dropdownItems: [
      { label: 'Buat Laporan Baru', path: '/masyarakat/laporan-baru' },
      { label: 'Riwayat Laporan', path: '/masyarakat/riwayat-laporan' },
    ],
  },
  'admin-direksi': {
    dashboardPath: '/',
    dropdownLabel: 'Laporan Saya',
    dropdownItems: [
      { label: 'Identitas Proyek', path: '/admin-direksi/identitas-proyek' },
      { label: 'Rencana Anggaran', path: '/admin-direksi/rencana-anggaran' },
      { label: 'Jadwal Pelaksanaan', path: '/admin-direksi/jadwal-pelaksanaan' },
      { label: 'Realisasi Pekerjaan', path: '/admin-direksi/realisasi-pekerjaan' },
      { label: 'Project Progress (Kurva S)', path: '/admin-direksi/project-kurva-s' },
      { label: 'Dokumentasi', path: '/admin-direksi/dokumentasi' },
      { label: 'Evaluasi', path: '/admin-direksi/evaluasi' },
    ],
  },
  'admin-ppk': {
    dashboardPath: '/',
    dropdownLabel: 'Laporan Saya',
    dropdownItems: [
      { label: 'Identitas Proyek', path: '/admin-ppk/identitas-proyek' },
      { label: 'Rencana Anggaran', path: '/admin-ppk/rencana-anggaran' },
      { label: 'Jadwal Pelaksanaan', path: '/admin-ppk/jadwal-pelaksanaan' },
      { label: 'Realisasi Pekerjaan', path: '/admin-ppk/realisasi-pekerjaan' },
      { label: 'Project Progress (Kurva S)', path: '/admin-ppk/project-kurva-s' },
      { label: 'Dokumentasi', path: '/admin-ppk/dokumentasi' },
      { label: 'Evaluasi', path: '/admin-ppk/evaluasi' },
    ],
  },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLaporanOpen, setIsLaporanOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { handleLogout } = useAuthHooks();
  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const type = user ? user.role : 'guest';
  const config = navConfig[type];

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = config?.dropdownItems.some(i => isActive(i.path));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsLaporanOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarText = user?.fullname.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const NavLink = ({ label, path, icon: Icon }: { label: string; path: string; icon?: React.ElementType }) => (
    <button
      onClick={() => { navigate(path); setIsMenuOpen(false); }}
      className={`relative font-poppins-medium text-[13.5px] px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 group ${isActive(path)
        ? 'text-primary bg-primary/10'
        : 'text-gray-600 hover:text-primary hover:bg-primary/8'
      }`}
    >
      {Icon && <Icon size={15} className={isActive(path) ? 'text-primary' : 'text-gray-400 group-hover:text-primary'} />}
      {label}
      {isActive(path) && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
      )}
    </button>
  );

  if (loading) return null;

  return (
    <nav
      className={`w-full px-4 md:px-8 fixed top-0 left-0 right-0 z-9998 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 py-5'
        : 'bg-white shadow-sm py-4'
      }`}
    >
      <div className="max-w-8xl mx-auto flex items-center justify-between gap-4">

        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-200">
            <img src={logo} className="w-auto h-7" alt="Logo" />
          </button>

          {type !== 'guest' && config && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink label="Dashboard" path={config.dashboardPath} icon={LayoutDashboard} />
              <NavLink label="Lokasi Proyek" path="/lokasi-proyek" icon={MapPin} />

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsLaporanOpen(v => !v)}
                  className={`font-poppins-medium text-[13.5px] px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${isDropdownActive || isLaporanOpen
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/8'
                  }`}
                >
                  <FileText size={15} className={isDropdownActive ? 'text-primary' : 'text-gray-400'} />
                  {config.dropdownLabel}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLaporanOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 z-9998 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 pb-2 pt-1">
                      <p className="text-[10px] font-poppins-semibold text-gray-400 uppercase tracking-widest">{config.dropdownLabel}</p>
                    </div>
                    {config.dropdownItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { navigate(item.path); setIsLaporanOpen(false); }}
                        className={`w-full text-left text-[13px] font-poppins-regular px-4 py-2.5 mx-1 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-2.5 ${isActive(item.path)
                          ? 'bg-primary/10 text-primary font-poppins-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`}
                        style={{ width: 'calc(100% - 8px)' }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive(item.path) ? 'bg-primary' : 'bg-gray-200'}`} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'guest' && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink label="Dashboard" path="/" icon={LayoutDashboard} />
              <NavLink label="Lokasi Proyek" path="/lokasi-proyek" icon={MapPin} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {type === 'guest' && (
            <button
              onClick={() => navigate("/masuk")}
              className="hidden md:flex font-poppins-semibold text-[13px] text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[0.98] shadow-sm"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #065f46 100%)' }}
            >
              Masuk
            </button>
          )}

          {type !== 'guest' && (
            <div className="hidden md:flex items-center" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(v => !v)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${isProfileOpen ? 'bg-primary/10' : 'hover:bg-gray-100'}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20">
                  {user?.profile_photo ? (
                    <img className="w-full h-full object-cover" src={`${BASE_URL_FILE}/${user.profile_photo}`} alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-[11px] font-poppins-bold"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #065f46 100%)' }}>
                      {avatarText}
                    </div>
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-poppins-semibold text-[13px] text-gray-800 leading-tight">{user?.fullname}</p>
                  <p className="font-poppins-regular text-[10px] text-gray-400 capitalize leading-tight">{type.replace('-', ' ')}</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-4 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 z-9998">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="font-poppins-semibold text-[13px] text-gray-800">{user?.fullname}</p>
                    <p className="font-poppins-regular text-[11px] text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate("/ubah-profile"); setIsProfileOpen(false); }}
                    className="w-full text-left font-poppins-regular text-[13px] px-4 py-2.5 hover:bg-gray-50 hover:text-primary transition-colors duration-150 flex items-center gap-3 text-gray-600"
                  >
                    <User size={15} />
                    Ubah Profile
                  </button>
                  <div className="mx-3 my-1 h-px bg-gray-100" />
                  <button
                    onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                    className="w-full text-left font-poppins-regular text-[13px] px-4 py-2.5 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-3 text-red-500"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 transition-all duration-200 hover:bg-primary/20"
            onClick={() => setIsMenuOpen(v => !v)}
          >
            {isMenuOpen
              ? <X size={18} className="text-primary" />
              : <Menu size={18} className="text-primary" />
            }
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="pt-3 pb-4 flex flex-col gap-1 border-t border-gray-100 mt-2.5">

          {type !== 'guest' && (
            <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl mx-1" style={{ background: 'linear-gradient(135deg, var(--color-primary)/8% 0%, #065f46/5% 100%)' }}>
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20">
                {user?.profile_photo ? (
                  <img className="w-full h-full object-cover" src={`${BASE_URL_FILE}/${user.profile_photo}`} alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-[12px] font-poppins-bold"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #065f46 100%)' }}>
                    {avatarText}
                  </div>
                )}
              </div>
              <div>
                <p className="font-poppins-semibold text-[13px] text-gray-800">{user?.fullname}</p>
                <p className="font-poppins-regular text-[11px] text-gray-400 capitalize">{type.replace('-', ' ')}</p>
              </div>
            </div>
          )}

          {(type !== 'guest' ? [
            { label: 'Dashboard', path: config?.dashboardPath ?? '/', icon: LayoutDashboard },
            { label: 'Lokasi Proyek', path: '/lokasi-proyek', icon: MapPin },
          ] : [
            { label: 'Dashboard', path: '/', icon: LayoutDashboard },
            { label: 'Lokasi Proyek', path: '/lokasi-proyek', icon: MapPin },
          ]).map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
              className={`w-full text-left font-poppins-medium text-[13.5px] px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-150 ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}
            >
              <item.icon size={16} className={isActive(item.path) ? 'text-primary' : 'text-gray-400'} />
              {item.label}
            </button>
          ))}

          {type !== 'guest' && config && (
            <div>
              <button
                onClick={() => setIsLaporanOpen(v => !v)}
                className={`w-full text-left font-poppins-medium text-[13.5px] px-4 py-3 rounded-xl flex items-center justify-between gap-3 transition-all duration-150 ${isDropdownActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}
              >
                <span className="flex items-center gap-3">
                  <FileText size={16} className={isDropdownActive ? 'text-primary' : 'text-gray-400'} />
                  {config.dropdownLabel}
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isLaporanOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-4 mt-1 flex flex-col gap-0.5 pl-3 border-l-2 border-primary/20">
                  {config.dropdownItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate(item.path); setIsLaporanOpen(false); setIsMenuOpen(false); }}
                      className={`w-full text-left text-[13px] px-3 py-2.5 rounded-lg transition-all duration-150 ${isActive(item.path) ? 'bg-primary/10 text-primary font-poppins-medium' : 'text-gray-600 font-poppins-regular hover:bg-gray-50 hover:text-primary'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
            {type === 'guest' ? (
              <button
                onClick={() => { navigate("/masuk"); setIsMenuOpen(false); }}
                className="w-full font-poppins-semibold text-[13.5px] text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #065f46 100%)' }}
              >
                Masuk ke Akun
              </button>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/ubah-profile'); setIsMenuOpen(false); }}
                  className="w-full text-left font-poppins-regular text-[13px] px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors duration-150 flex items-center gap-3"
                >
                  <User size={15} />
                  Ubah Profile
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full text-left font-poppins-regular text-[13px] px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-3"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}