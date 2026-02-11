import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "/image/logo/logo-monalisa.png";
import background from "/image/auth/background.jpg";
import emailjs from "@emailjs/browser"
import { SwalMessage } from '../../utils/SwalMessage';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendResetLink = async () => {
    if (!email) {
      SwalMessage({
        type: "error",
        title: "Gagal!",
        text: "Email wajib diisi!"
      })
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      SwalMessage({
        type: "error",
        title: "Gagal!",
        text: "Email tidak sesuai format!"
      })
      return;
    }

    setLoading(true);

    try {
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetLink = `${window.location.origin}/reset-kata-sandi?token=${resetToken}&email=${encodeURIComponent(email)}`;

      const templateParams = {
        recipient: email,
        reset_link: resetLink,
      };

      await emailjs.send(
        'service_monalisa',
        'template_tp9yd1z',
        templateParams,
        '4xmHCdiisL4Jr1CLL'
      );

      SwalMessage({
        type: "success",
        title: "Berhasil!",
        text: "Email berhasil terkirim!"
      });

      setTimeout(() => {
        navigate('/masuk');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      SwalMessage({
        type: "error",
        title: "Gagal!",
        text: "Terjadi Kesalahan!"
      })
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex justify-center items-center gap-4 mb-4">
            <ArrowLeft 
              className="w-6 h-6 cursor-pointer hover:scale-90 transition-all text-gray-700" 
              onClick={() => navigate("/masuk")}
            />
            <img src={logo} className='w-auto h-4 mx-auto'/>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lupa Kata Sandi?</h1>
          <p className="text-gray-600">Masukkan email Anda untuk menerima link reset password</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-third focus:ring-2 focus:ring-hover"
                placeholder="contoh@email.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendResetLink();
                  }
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendResetLink}
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#f60' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ff7a1a')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f60')}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Kirim Link Reset
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/masuk')}
              className="text-sm font-medium hover:underline"
              style={{ color: '#f60' }}
            >
              Kembali ke halaman login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}