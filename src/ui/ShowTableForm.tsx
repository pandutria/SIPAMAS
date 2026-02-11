interface showTableFormProps {
    onClick?: () => void;
    tenderCode?: string;
    disabled?: boolean;
    required?: boolean;
}

export default function ShowTableForm({ tenderCode, onClick, disabled=false, required=true }: showTableFormProps) {
    return (
        <div>
            <label className="block font-poppins-medium text-xs sm:text-sm text-gray-700 mb-2">
                Kode Paket 
                <span className="text-primary">{required ? " *" : ""}</span>
            </label>
            <div className="    flex flex-col sm:flex-row w-full gap-2 sm:gap-4 items-stretch sm:items-center">
                <div className="flex-1 text-xs sm:text-[14px] px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg font-poppins-medium text-left text-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-between">
                    <span className="truncate">{tenderCode || 'Pilih Tender'}</span>
                </div>
                {!disabled && (
                    <button onClick={onClick} className='font-poppins-regular text-white bg-primary px-3 sm:px-4 py-2 sm:py-2.5 w-full sm:w-36 text-xs sm:text-[14px] rounded-lg cursor-pointer border-2 border-primary hover:bg-transparent hover:text-primary transition-all whitespace-nowrap'>List Tender</button>
                )}
            </div>
        </div>
    )
}