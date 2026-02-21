/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react'
import usePokjaGroupHooks from '../../../hooks/PokjaGroupHooks'

interface UbahKelompokKerjaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: { namaKelompokKerja: string }) => void
  data?: any
}

export default function AdminUbahKelompokKerjaModal({
  isOpen,
  onClose,
  data
}: UbahKelompokKerjaModalProps) {
  const { handlePokjaGroupUpdate, handlePokjaGroupChange, pokjaGroupName } = usePokjaGroupHooks();
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-poppins-bold text-xl text-gray-800">
            Ubah Kelompok Kerja
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <label className="block font-poppins-medium text-sm text-gray-700 mb-2">
            Nama Kelompok Kerja <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={pokjaGroupName ? pokjaGroupName : data.name}
            name='pokja-group'
            onChange={handlePokjaGroupChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            placeholder="Masukkan nama kelompok kerja"
          />
        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={() => handlePokjaGroupUpdate(data.id)}
            className="px-8 py-2.5 bg-primary hover:bg-transparent border-2 border-primary hover:text-primary text-white font-poppins-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
