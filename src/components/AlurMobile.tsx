import icon1 from "/image/alur-mobile/icon1.png"
import icon2 from "/image/alur-mobile/icon2.png"
import icon3 from "/image/alur-mobile/icon3.png"
import icon4 from "/image/alur-mobile/icon4.png"
import icon5 from "/image/alur-mobile/icon5.png"
import icon6 from "/image/alur-mobile/icon6.png"
import icon7 from "/image/alur-mobile/icon7.png"
import icon8 from "/image/alur-mobile/icon8.png"
import icon9 from "/image/alur-mobile/icon9.png"
import icon10 from "/image/alur-mobile/icon10.png"
import iconBtn from "/image/alur-mobile/icon-btn.png"
import SafeAreaView from "../ui/SafeAreaView"

const alurMobileData = [
    {
        id: 1,
        image: icon1,
        title: "Buka Aplikasi",
        desc: "Masyarakat membuka aplikasi untuk memulai laporan."
    },
    {
        id: 2,
        image: icon2,
        title: "Isi Form Aduan",
        desc: "Upload foto bukti dan pilih titik lokasi GPS secara akurat."
    },
    {
        id: 3,
        image: icon3,
        title: "Kode Laporan",
        desc: "Sistem mencatat & memberikan kode kepada pengguna dan admin."
    },
    {
        id: 4,
        image: icon4,
        title: "Notifikasi Admin",
        desc: "Admin menerima notif karena mendapatkan adanya aduan baru."
    },
    {
        id: 5,
        image: icon5,
        title: "Validasi",
        desc: "Verifikator memvalidasi kelayakan data laporan."
    },
    {
        id: 6,
        image: icon6,
        title: "Disposisi",
        desc: "Laporan valid diteruskan ke instasi terkait."
    },
    {
        id: 7,
        image: icon7,
        title: "Tindak Lanjut",
        desc: "Petugas lapangan mengerjakan & update status."
    },
    {
        id: 8,
        image: icon8,
        title: "Notifikasi User",
        desc: "Sistem mengirim notifikasi update ke pelapor."
    },
    {
        id: 9,
        image: icon9,
        title: "Feedback",
        desc: "Pelapor memberi rating atas penyelesaian laporan."
    },
    {
        id: 10,
        image: icon10,
        title: "Rekap Data",
        desc: "Data terekam dalam dashboard rekap pengaduan."
    },
];

export default function AlurMobile() {
    return (
        <div data-aos="fade-up" data-aos-duration="1000">
            <SafeAreaView className="flex-col gap-12">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="font-poppins-semibold lg:text-[40px] text-[28px]">Alur Detail <span className="text-primary">Pelaporan Versi Mobile</span></h1>
                    <p className="font-poppins-medium text-gray-600 lg:text-[16px] text-[14px] text-justify">Proses lengkap dari pelaporan masyarakat hingga evaluasi dalam satu ekosistem intergrasi</p>
                </div>
                <div className="grid lg:grid-cols-5 grid-cols-2 justify-between w-full items-center lg:gap-8 gap-6">
                    {alurMobileData.map((item, index) => (
                        <div className="bg-white hover:border-primary duration-300 border-2 border-gray-200 rounded-lg lg:p-4 p-2 flex flex-col justify-center gap-6 w-auto lg:h-50 h-44 cursor-pointer relative group" key={index}>
                            <p className="text-primary bg-white border-2 border-primary group-hover:bg-primary group-hover:text-white duration-300 rounded-full p-2 flex justify-center items-center text-[16px] w-8 h-8 absolute -top-4 -left-4 font-poppins-semibold">{item.id}</p>
                            <img src={item.image} className="lg:w-12 w-10 bg-primary/20 rounded-lg p-2 h-auto" alt="" />
                            <div className="flex flex-col gap-2">
                                <h1 className="lg:text-[18px] text-[12px] font-poppins-semibold">{item.title}</h1>
                                <p className="font-poppins-medium lg:text-[12px] text-[10px] text-justify text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className='font-poppins-semibold lg:mt-4 mt-6 flex w-fit justify-center items-center gap-4 text-white bg-linear-to-r from-primary to-secondary py-3 px-4 cursor-pointer hover:scale-95 duration-300 hover:opacity-95 rounded-md lg:text-[18px] text-[14px]'>
                    <p>Laporkan Aduan Anda</p>
                    <img className="lg:w-8 w-4 h-auto" src={iconBtn} alt="" />
                </button>
            </SafeAreaView>
        </div>
    )
}
