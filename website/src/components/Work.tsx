import SafeAreaView from "../ui/SafeAreaView"

const workData = [
    {
        id: 1,
        title: "Pengumpulan Data",
        desc: "Petugas lapangan mengunggah data progres, foto, dan koordinat lokasi melalui aplikasi mobile"
    },
    {
        id: 2,
        title: "Verifikasi & Analisis",
        desc: "Sistem Memvalidasi geo-tagging dan kelengkapan data sebelum disetujui manager"
    },
    {
        id: 3,
        title: "Publikasi Real-time",
        desc: "Data yang terverifikasi divisualisasikan secara instan di dasbo admin untuk transparasi penuh"
    },
]

export default function Work() {
    return (
        <div className="bg-[#F3FFF8] py-6" data-aos="fade-up" data-aos-duration="1000">
            <SafeAreaView className="flex-col gap-12">
                <div className="flex flex-col justify-center items-center gap-2">
                    <h1 className="font-poppins-semibold lg:text-[40px] text-[28px]">Cara Kerja Sistem</h1>
                    <p className="font-poppins-medium lg:text-[18px] text-[14px] lg:text-start text-center text-gray-600">Alur kerja efisien dari pengumpulan data di lapangan hingga transparasi publik</p>
                </div>
                <div className="lg:mt-10 mt-4 grid lg:grid-cols-3 grid-cols-1 justify-between w-full lg:gap-8 gap-16">
                    {workData.map((item, index) => (
                        <div className="flex flex-col items-center gap-8" key={index}>
                            <div className="lg:w-26 lg:h-26 w-22 h-22 flex justify-center items-center border-2 border-primary rounded-full shadow-[0_0_25px_rgba(34,197,94,0.45)]">
                                <h1 className="text-primary font-poppins-semibold lg:text-[30px] text-[24px]">{item.id}</h1>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="font-poppins-semibold text-center lg:text-[24px] text-[18px]">{item.title}</h1>
                                <p className="text-center font-poppins-medium lg:text-[14px] text-[12px] text-gray-600">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SafeAreaView>
        </div>
    )
}
