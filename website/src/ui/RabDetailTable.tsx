import { Trash2 } from "lucide-react";
import FormatRupiah from "../utils/FormatRupiah";

interface RabDetailTableProps {
  dataFile: RABDetailProps[];
  handleDeleteRow: (index: number) => void
  showDelete?: boolean;
}

export default function RabDetailTable({ dataFile, handleDeleteRow, showDelete = true }: RabDetailTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-primary/20 to-primary/10 border-b-2 border-primary/30">
              <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
                Keterangan
              </th>
              <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
                Satuan
              </th>
              <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
                Harga Satuan
              </th>
              <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider bg-primary/5">
                Total
              </th>
              {showDelete && (
                <th className="px-6 py-4 text-center font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataFile?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-gray-300">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="font-poppins-medium text-gray-500">Tidak ada data</p>
                    <p className="font-poppins-regular text-gray-400 text-sm">Upload file Excel untuk menampilkan RAB</p>
                  </div>
                </td>
              </tr>
            ) : (
              dataFile?.map((item: RABDetailProps, index) => (
                <tr
                  key={index}
                  className="hover:bg-primary/2 transition-all duration-200 border-b border-gray-100"
                >
                  <td className="px-6 py-4 text-center font-poppins-medium text-sm text-gray-800 max-w-sm">
                    <div className="truncate hover:text-clip" title={item.keterangan}>
                      {item.keterangan}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-poppins-regular text-center text-sm text-gray-700">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-poppins-medium text-xs whitespace-nowrap">
                      {item.satuan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-poppins-semibold text-sm text-gray-800 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-poppins-bold text-xs">
                      {item.volume}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-poppins-semibold text-sm text-gray-800 text-center">
                    {FormatRupiah(item.harga)}
                  </td>
                  <td className="px-6 py-4 font-poppins-bold text-sm text-primary text-center bg-primary/3 hover:bg-primary/5 transition-all duration-200">
                    {FormatRupiah(item.total)}
                  </td>
                  {showDelete && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                          title="Hapus baris"
                          aria-label="Hapus baris"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {dataFile?.length > 0 && (
        <div className="bg-linear-to-r from-primary/5 to-primary/2 px-6 py-4 border-t-2 border-primary/20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-8">
            <div>
              <p className="font-poppins-regular text-gray-600 text-sm">Total Item</p>
              <p className="font-poppins-bold text-primary text-lg">{dataFile.length}</p>
            </div>
            <div>
              <p className="font-poppins-regular text-gray-600 text-sm">Total Volume</p>
              <p className="font-poppins-bold text-primary text-lg">
                {dataFile.reduce((sum, item) => sum + Number(item.volume), 0)}
              </p>
            </div>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg border-2 border-primary/20 shadow-sm">
            <p className="font-poppins-regular text-gray-600 text-sm mb-1">Total RAB</p>
            <p className="font-poppins-bold text-primary text-xl">
              {FormatRupiah(dataFile.reduce((sum, item) => sum + Number(item.total), 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
