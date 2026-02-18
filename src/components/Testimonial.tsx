import { ChevronDown } from "lucide-react"
import SafeAreaView from "../ui/SafeAreaView";
import { useState } from "react";

const testimonialData = [
    {
        id: 1,
        question: "Apa itu SIPAMAS?",
        answer: "SIPAMAS adalah platform digital berbasis web yang menyediakan layanan pengaduan dan partisipasi masyarakat untuk melaporkan permasalahan pembangunan dan memantau tindak lanjut laporan."
    },
    {
        id: 2,
        question: "Apakah data saya aman?",
        answer: "SIPAMAS adalah platform digital berbasis web yang menyediakan layanan pengaduan dan partisipasi masyarakat untuk melaporkan permasalahan pembangunan dan memantau tindak lanjut laporan."
    },
    {
        id: 3,
        question: "Siapa saja yang dapat menggunakan SIPAMAS?",
        answer: "SIPAMAS adalah platform digital berbasis web yang menyediakan layanan pengaduan dan partisipasi masyarakat untuk melaporkan permasalahan pembangunan dan memantau tindak lanjut laporan."
    },
    {
        id: 4,
        question: "Bagaimana cara melaporkan masalah melalui SIPAMAS?",
        answer: "SIPAMAS adalah platform digital berbasis web yang menyediakan layanan pengaduan dan partisipasi masyarakat untuk melaporkan permasalahan pembangunan dan memantau tindak lanjut laporan."
    },
];

export default function Testimonial() {
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const handleClick = (itemId: number) => {
        if (isOpen == itemId) {
            setIsOpen(null)
        } else {
            setIsOpen(itemId)
        }
    }

    return (
        <div data-aos="fade-up" data-aos-duration="1000" className="mb-16">
            <SafeAreaView className="flex lg:flex-row flex-col items-center gap-12">
                <div className="flex flex-col gap-2 lg:w-150 w-auto">
                    <div className="bg-linear-to-r from-primary to-secondary w-fit py-2 px-4 rounded-md">
                        <p className='font-poppins-medium text-white text-[14px]'>Pertanyaan</p>
                    </div>
                    <h1 className="font-poppins-semibold lg:text-[40px] text-[28px]">Pertanyaan yang <br className="lg:block hidden" /> Sering <span className="text-primary">Diajukan</span></h1>
                    <p className="font-poppins-medium text-gray-600 lg:text-[14px] text-[12px] text-justify">Punya pertanyaan seputar pembangunan dan layanan publik? Kami siap membantu Anda menyampaikan laporan dan memahami proses penanganan secara transparan dan mudah dipahami oleh masyarakat.</p>
                </div>
                <div className="flex flex-col gap-8 lg:w-140 w-auto">
                    {testimonialData.map((item, index) => (
                        <div className="p-4 border-2 border-gray-200 bg-white rounded-lg flex flex-col duration-300 gap-8 overflow-hidden" style={{ height: isOpen == item.id ? "190px" : "80px" }} key={index}>
                            <div onClick={() => handleClick(item.id)} className="w-full flex justify-between items-center cursor-pointer gap-6">
                                <h1 className="font-poppins-semibold lg:text-[18px] text-[14px]">{item.question}</h1>
                                <ChevronDown className="bg-primary rounded-full text-white p-1.5 lg:w-10 w-8 lg:h-10 h-8 shrink-0 duration-200" style={{ rotate: isOpen == item.id ? "180deg" : "0deg" }} />
                            </div>
                            <p className="lg:text-[14px] text-[12px] font-poppins-medium text-justify duration-300" style={{ color: isOpen == item.id ? "black" : "white" }}>{item.answer}</p>
                        </div>
                    ))}
                </div>
            </SafeAreaView>
        </div>
    )
}
