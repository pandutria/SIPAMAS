import SafeAreaView from '../ui/SafeAreaView'
import image from "/image/home/image.png"
import icon1 from "/image/home/icon1.png"
import icon2 from "/image/home/icon2.png"
import icon3 from "/image/home/icon3.png"

export default function Home() {
    return (
        <div className="lg:mt-14 mt-18">
            <SafeAreaView className='lg:flex-row flex-col'>
                <div className="flex flex-col gap-4 items-start justify-center lg:w-140 w-auto">
                    <div className="bg-primary/20 w-fit py-2 px-4 rounded-full flex justify-center items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <p className='text-primary font-poppins-semibold text-[12px]'>Platform Pengaduan Masyarakat</p>
                    </div>
                    <h1 className='font-poppins-bold lg:text-[46px] text-[30px] text-black'>Transparasi Bertemu <span className='text-primary'>Efisiensi</span> dalam Manajemen</h1>
                    <p className='text-gray-600 font-poppins-medium text-justify text-[14px]'>Pusat terpadu untuk memantau, mengevaluasi, dan melaporkan inisiatif pembangunan secara real-time. Aman, transparan, dan dibangun untuk dampak nyata</p>
                    <button className='font-poppins-semibold text-white bg-linear-to-r from-primary to-secondary py-3 px-4 cursor-pointer hover:scale-95 duration-300 hover:opacity-95 rounded-md text-[14px]'>Mulai Sekarang</button>
                    <div className="flex justify-center items-center gap-8 mt-4">
                        <div className="flex flex-col">
                            <h1 className='font-poppins-bold lg:text-[28px] text-[24px]'>100+</h1>
                            <p className='font-poppins-medium lg:text-[18px] text-[12px]'>Laporan Masuk</p>
                        </div>
                        <div className="flex flex-col">
                            <h1 className='font-poppins-bold lg:text-[28px] text-[24px]'>10K+</h1>
                            <p className='font-poppins-medium lg:text-[18px] text-[12px]'>Pengguna Terdaftar</p>
                        </div>
                        <div className="flex flex-col">
                            <h1 className='font-poppins-bold lg:text-[28px] text-[24px]'>300+</h1>
                            <p className='font-poppins-medium lg:text-[18px] text-[12px]'>Lokasi Aduan</p>
                        </div>
                    </div>
                </div>
                <div className="relative lg:block hidden">
                    <div className="absolute bg-linear-to-r from-primary to-secondary p-2 rounded-md flex justify-center items-center gap-2 top-14 -left-12 bounce">
                        <img src={icon1} className='h-auto w-8' alt="" />
                        <p className='font-poppins-medium text-white text-[14px]'>Pelaporan Publik</p>
                    </div>
                    <div className="absolute bg-linear-to-r from-primary to-secondary p-2 rounded-md flex justify-center items-center gap-2 top-52 -right-12 bounce">
                        <img src={icon2} className='h-auto w-8' alt="" />
                        <p className='font-poppins-medium text-white text-[14px]'>Pantau Status Laporan</p>
                    </div>
                    <div className="absolute bg-linear-to-r from-primary to-secondary p-2 rounded-md flex justify-center items-center gap-2 top-86 -left-12 bounce">
                        <img src={icon3} className='h-auto w-8' alt="" />
                        <p className='font-poppins-medium text-white text-[14px]'>Partisipasi untuk Semua</p>
                    </div>
                    <img src={image} className='w-auto h-[74vh]' alt="" />
                </div>
            </SafeAreaView>
        </div>
    )
}
