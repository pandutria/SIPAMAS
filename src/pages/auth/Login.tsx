import { Mail, Lock, RefreshCw } from 'lucide-react';
import useAuthHooks from '../../hooks/AuthHooks';
import logo from "/image/logo/logo-monalisa.png";
import { ArrowLeft } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import background from "/image/auth/background.jpg";
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../ui/LoadingSpinner';

export default function Login() {
  const { email, password, handleChange, handleLogin, captchaCode, captchaInput, refreshCaptcha, setCaptchaInput } = useAuthHooks();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner/>
  }

  if (user) {
    return <Navigate to="/" replace/>
  }
  return (
    <div
      className="h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-lg"
        data-aos="fade-up"
        data-aos-duration="1000"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <ArrowLeft className="w-auto h-6 cursor-pointer hover:scale-90 transition-all" onClick={() => navigate("/")}/>
            <img src={logo} className='w-auto h-4 mx-auto mb-4'/>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h1>
          <p className="text-gray-600">Silakan masuk ke akun Anda</p>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name='email'
                value={email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-third focus:ring-2 focus:ring-hover"
                placeholder="contoh@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name='password'
                value={password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-third focus:ring-2 focus:ring-hover"
                placeholder="Masukkan kata sandi"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kode Verifikasi (CAPTCHA)
            </label>
            <div className="flex gap-3 items-center mb-3">
              <div
                className="flex-1 rounded-lg flex items-center justify-center select-none font-semibold text-2xl tracking-widest text-gray-600 italic"
                style={{
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #ddd',
                  minHeight: '80px'
                }}
              >
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg transition-colors duration-200"
                title="Muat ulang captcha"
              >
                <RefreshCw className="h-6 w-6 text-gray-700" />
              </button>
              <input
                type="text"
                id="captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-third focus:ring-2 focus:ring-hover"
                placeholder="Masukkan kode di atas"
                maxLength={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleLogin()
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="font-medium hover:underline text-primary"
              onClick={() => navigate("/lupa-kata-sandi")}
            >
              Lupa kata sandi?
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleLogin()}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-secondary"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
};