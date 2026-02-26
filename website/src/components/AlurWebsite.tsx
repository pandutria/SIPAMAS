import SafeAreaView from "../ui/SafeAreaView";
import icon1 from "/image/alur-website/icon1.png";
import icon2 from "/image/alur-website/icon2.png";
import icon3 from "/image/alur-website/icon3.png";
import icon4 from "/image/alur-website/icon4.png";
import icon5 from "/image/alur-website/icon5.png";
import icon6 from "/image/alur-website/icon6.png";

const alurWebsiteData = [
    {
        id: 1,
        image: icon1,
        title: "Login/Akses Portal Web",
        desc: "Gunakan kredensial yang aman untuk masuk ke portal pelaporan khusus melalui peramban web standar."
    },
    {
        id: 2,
        image: icon2,
        title: "Dashboard Publik",
        desc: "Akses dashboard utama yang menyajikan statistik terkini dan navigasi cepat menuju formulir pelaporan."
    },
    {
        id: 3,
        image: icon3,
        title: "Input Data Aduan Lengkap",
        desc: "Isi Formulir berbasis web dengan detail narasi yang mendalam, kategori aduan, dan data pendukung lain."
    },
    {
        id: 4,
        image: icon4,
        title: "Penandaan Lokasi Pada Peta Interaktif",
        desc: "Pilih lokasi secara presisi menggunakan peta interaktif dengan tampilan satelit untuk akurasi maksimal."
    },
    {
        id: 5,
        image: icon5,
        title: "Unggah Dokumen & Bukti Visual",
        desc: "Fasilitas drag-drop untuk mengunggah dokumen PDF, File foto resolusi tinggi, atau video bukti lapangan."
    },
    {
        id: 6,
        image: icon6,
        title: "Preview & Finalisasi Laporan",
        desc: "Tinjau kembali seluruh informasi sebelum dikirimkan ke sistem pusat untuk diverifikasi oleh tim admin."
    },
]

export default function AlurWebsite() {
    return (
        <div data-aos="fade-up" data-aos-duration="1000">
            <SafeAreaView className="flex-col items-start lg:gap-12 gap-8">
                <div className="flex flex-col gap-2 lg:w-180 w-auto">
                    <h1 className="font-poppins-semibold lg:text-[40px] text-[28px]">Alur Pelaporan <span className="text-primary">Versi Website</span></h1>
                    <p className="lg:text-[16px] text-[14px] text-justify text-gray-400 font-poppins-medium">Pengalaman desktop yang dioptimalkan untuk penginputan data mendalam dan manajemen dokumen yang lebih komprehensif.</p>
                </div>
                <div className="grid lg:grid-cols-2 grid-cols-1 justify-between lg:gap-12 gap-8 w-full">
                    {alurWebsiteData.map((item, index) => (
                        <div className="flex justify-start items-start gap-4" key={index}>
                            <div className="p-4 w-12 h-12 rounded-lg flex justify-center items-center border-2 border-gray-200">
                                <h1 className="text-primary font-poppins-semibold text-[20px]">{item.id}</h1>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <img src={item.image} className="w-6 h-auto" alt="" />
                                    <h1 className="text-black font-poppins-semibold lg:text-[18px] text-[14px]">{item.title}</h1>
                                </div>
                                <p className="text-gray-600 text-justify font-poppins-medium lg:text-[14px] text-[10px]">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SafeAreaView>
        </div>
    )
}
