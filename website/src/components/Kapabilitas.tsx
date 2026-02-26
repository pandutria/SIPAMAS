import SafeAreaView from "../ui/SafeAreaView"
import icon1 from "/image/kapabilitas/icon1.png"
import icon2 from "/image/kapabilitas/icon2.png"
import icon3 from "/image/kapabilitas/icon3.png"

const kapabilitasData = [
    {
        id: 1,
        image: icon1,
        title: "Pantau Secara Real-Time",
        desc: "Lihat perkembangan laporan dan tindak lanjut secara langsung melalui tampilan yang jelas dan mudah dipahami."
    },
    {
        id: 2,
        image: icon2,
        title: "Lokasi Akurat (GPS)",
        desc: "Setiap laporan dilengkapi titik lokasi untuk memastikan keakuratan data dan verifikasi di lapangan."
    },
    {
        id: 3,
        image: icon3,
        title: "Laporan Terintegrasi",
        desc: "Semua laporan tercatat dengan otomatis. terdokumentasi rapi, dan dapat ditelusuri hingga selesai."
    },
]

export default function Kapabilitas() {
    return (
        <div data-aos="fade-up" data-aos-duration="1000">
            <SafeAreaView className="flex-col gap-14 items-start">
                <div className="flex flex-col gap-2 lg:w-180 w-auto">
                    <h1 className="font-poppins-semibold lg:text-[44px] text-[28px]">Kapabilitas Utama <span className="text-primary">SIPAMAS</span></h1>
                    <p className="text-gray-600 font-poppins-medium text-justify lg:text-[16px] text-[12px]">Dirancang untuk memudahkan masyarakat melapor, memantau, dan memastikan aduan ditindaklanjuti secara transparan dan terukur.</p>
                </div>
                <div className="grid lg:grid-cols-3 grid-cols-1 justify-between w-full lg:gap-6 gap-8">
                    {kapabilitasData.map((item, index) => (
                        <div className="bg-primary/35 p-4 rounded-lg border-secondary/35 border-2 flex flex-col gap-4 cursor-pointer hover:scale-105 duration-300" key={index}>
                            <img className="lg:w-14 w-10 bg-primary/45 p-2 rounded-lg border-2 border-secondary/35 h-auto" src={item.image} alt="" />
                            <div className="flex flex-col gap-2">
                                <h1 className="text-secondary font-poppins-semibold lg:text-[20px] text-[16px]">{item.title}</h1>
                                <p className="text-black font-poppins-medium lg:text-[14px] text-[12px] text-justify">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SafeAreaView>
        </div>
    )
}
