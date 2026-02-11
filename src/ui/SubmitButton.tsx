interface submitButtonProps {
    text: string;
    onClick: () => void;
}

export default function SubmitButton({ text, onClick }: submitButtonProps) {
    return (
        <div className="mt-6">
            <button onClick={onClick} className="px-6 py-2.5 bg-primary hover:bg-transparent hover:text-primary border-2 border-primary cursor-pointer text-white font-poppins-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
                {text}
            </button>
        </div>
    )
}
