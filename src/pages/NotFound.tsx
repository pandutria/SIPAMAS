export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full" data-aos="fade-up" data-aos-duration="1000">
        <div className="text-center">
          <div className="relative mb-8">
            <h1 className="text-[180px] font-bold text-primary/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-8 shadow-2xl ring-4 ring-primary/20 animate-pulse">
                <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-primary to-primary/80 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-2 ring-primary/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Kembali ke Beranda
            </button>
            
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ring-2 ring-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Halaman Sebelumnya
            </button>
          </div>

          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md ring-1 ring-gray-200">
            <p className="text-sm text-gray-600">
              Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator atau coba lagi nanti.
            </p>
          </div>
        </div>

        <div className="fixed top-20 left-20 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse pointer-events-none"></div>
        <div className="fixed bottom-20 right-20 w-32 h-32 bg-blue-400/5 rounded-full blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="fixed top-40 right-40 w-16 h-16 bg-emerald-400/5 rounded-full blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}