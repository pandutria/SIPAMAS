interface submitButtonProps {
    text: string;
    onClick: () => void;
    width?: "full" | "fit"
}

export default function SubmitButton({ text, onClick, width="fit" }: submitButtonProps) {
    return (
        <div className="mt-8">
            <button onClick={onClick} className={`px-6 py-2.5 bg-primary hover:bg-transparent hover:text-primary border-2 border-primary cursor-pointer text-white font-poppins-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md ${width == "full" ? "w-full" : "w-fit" }`}>
                {text}
            </button>
        </div>
    )
}
