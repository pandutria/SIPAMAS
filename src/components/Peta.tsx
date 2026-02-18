import SafeAreaView from "../ui/SafeAreaView";
import image from "/image/peta/image.png"
import peta from "/image/peta/peta.png"
import arrow from "/image/peta/arrow.png"

export default function Peta() {
    return (
        <div className="" data-aos="fade-up" data-aos-duration="1000">
            <SafeAreaView className='lg:flex-row flex-col'>
                <img src={image} alt="" className="lg:w-auto w-full lg:h-[50vh] h-auto" />
                <div className="lg:w-130 w-auto flex flex-col gap-2 justify-center">
                    <div className="bg-primary/20 border-2 border-primary mb-2 w-fit px-4 py-2 rounded-md flex justify-center items-center gap-2">
                        <img src={peta} className="w-6 h-auto" alt="" />
                        <p className='text-primary font-poppins-semibold lg:text-[16px] text-[12px]'>Akses Publik</p>
                    </div>
                    <h1 className="font-poppins-semibold lg:text-[38px] text-[28px]">Sebaran Lokasi Proyek</h1>
                    <div className="flex flex-col gap-4">
                        <p className='text-gray-400 font-poppins-medium text-justify lg:text-[14px] text-[12px]'>Kami percaya bahwa transparasi dimulai dari keterbukaan data. setiap proyek pembangunan ditampilkan berdasarkan lokasi geografis yang tepat pada peta interaktif kami.</p>
                        <p className='text-gray-400 font-poppins-medium text-justify lg:text-[14px] text-[12px]'>Hal ini memnungkinkan publik untuk mengetahui proyek apa saja  yang sedang berhalan di lingkungan mereka, memantau kemajuan secara visual, dan memastikan pembangunan merata hingga ke pelosok daerah.</p>
                    </div>
                    <button className='font-poppins-semibold lg:mt-4 mt-6 flex w-fit justify-center items-center gap-4 text-white bg-linear-to-r from-primary to-secondary py-3 px-4 cursor-pointer hover:scale-95 duration-300 hover:opacity-95 rounded-md lg:text-[18px] text-[14px]'>
                        <p>Lihat Peta Proyek</p>
                        <img className="lg:w-8 w-4 h-auto" src={arrow} alt="" />
                    </button>
                </div>
            </SafeAreaView>
        </div>
    )
}
