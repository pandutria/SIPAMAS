/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"

interface BackButtonProps {
    type?: "custom" | "default";
    link?: string;
}

export default function BackButton({ type='default', link }: BackButtonProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (type == "default") {
            navigate(-1);
        } else if (link) {
            navigate(link);
        }
    };
    return (
        <button onClick={handleBack} className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary font-poppins-medium mb-6 transition-colors duration-200">
            <ArrowLeft className="h-5 w-5" />
            Kembali
        </button>
    )
}
