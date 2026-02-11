/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import TableHeaderReport from "../../../ui/TableHeaderReport";
import TableContent from "../../../ui/TableContent";
import * as XLSX from "xlsx-js-style";
import useDataEntryHooks from "../../../hooks/DataEntryHooks";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import FormatRupiah from "../../../utils/FormatRupiah";
import { ParseNumber } from "../../../utils/ParseNumber";
import html2pdf from "html2pdf.js";

export default function KepalaHasilKelompokKerja() {
    const [tahun, setTahun] = useState('');
    const [metodePengadaan, setMetodePengadaan] = useState('');
    const [sumberDana, setSumberDana] = useState('');
    const tableRef = useRef<HTMLDivElement>(null);
    const [kelompokKerja, setKelompokKerja] = useState<any>(null);
    const { dataEntryPengadaan, tahunOptions, metodePengadaanOptions, sumberDanaOptions, groupOptions } = useDataEntryHooks();
    const [dataEntryFilter, setDataEntryFilter] = useState<DataEntryProps[]>([]);
    const { user, loading } = useAuth();
    const [metodeOptionsFilter, setMetodeOptionsFilter] = useState<any>([]);

    const columns = [
        {
            key: 'id',
            label: 'NO'
        },
        {
            key: 'pokja',
            label: 'Pokja'
        },
        {
            key: 'opd',
            label: 'OPD'
        },
        {
            key: 'nama_paket',
            label: 'NAMA PAKET'
        },
        {
            key: 'metode_pengadaan',
            label: 'METODE PENGADAAN'
        },
        {
            key: 'nilai_pagu',
            label: 'NILAI PAGU (Rp)'
        },
        {
            key: 'nilai_hps',
            label: 'NILAI HPS (Rp)'
        },
        {
            key: 'pemenang',
            label: 'PEMENANG'
        },
        {
            key: 'nilai_penawaran',
            label: 'NILAI PENAWARAN (Rp)'
        },
        {
            key: 'nilai_negosiasi',
            label: 'NILAI NEGOSIASI/ NILAI KONTRAK (Rp)'
        },
        {
            key: 'nomor_kontrak',
            label: 'NOMOR KONTRAK'
        },
        {
            key: 'nilai_kontrak',
            label: 'NILAI KONTRAK'
        },
        {
            key: 'efisiensi',
            label: 'EFISIENSI NILAI PAGU - KONTRAK'
        },
        {
            key: 'presentase',
            label: 'PRESENTASI'
        },
    ];

    useEffect(() => {
        const filteringDataEntry = () => {
            const dataFilter = dataEntryPengadaan?.filter((item: DataEntryProps) => {
                const filterType = item?.tipe?.includes("Kelompok");
                const tahunFilter = tahun
                    ? item?.tahun_anggaran?.toString().includes(tahun)
                    : true;

                const metodeFilter = metodePengadaan
                    ? item?.metode_pengadaan === metodePengadaan
                    : true;

                const sumberDanaFilter = sumberDana
                    ? item?.sumber_dana === sumberDana
                    : true;
                const kelompokKerjaFilter = kelompokKerja
                    ? item?.user?.pokja_group_id == kelompokKerja
                    : true;

                return filterType && tahunFilter && metodeFilter && sumberDanaFilter && kelompokKerjaFilter;
            });

            const metodeFilter = metodePengadaanOptions?.filter((item) => {
                return item?.text == "Tender" || item?.text == "Seleksi"
            });

            setMetodeOptionsFilter(metodeFilter);
            setDataEntryFilter(dataFilter);
        }

        filteringDataEntry();
    }, [dataEntryPengadaan, tahun, metodePengadaan, sumberDana, metodePengadaanOptions, user, kelompokKerja]);

    const calculateTotals = () => {
        const totals = {
            nilai_pagu: 0,
            nilai_hps: 0,
            nilai_penawaran: 0,
            nilai_negosiasi: 0,
            efisiensi: 0
        };

        dataEntryFilter.forEach(row => {
            totals.nilai_pagu += ParseNumber(row.nilai_pagu || 0);
            totals.nilai_hps += ParseNumber(row.nilai_hps || 0);
            totals.nilai_penawaran += ParseNumber(row.nilai_penawaran || 0);
            totals.nilai_negosiasi += ParseNumber(row.nilai_negosiasi || 0);
            totals.efisiensi += ParseNumber(row.efisiensi || 0);
        });

        return totals;
    };

    const handlePrint = () => {
        const printWindow = window.open("", "", "width=1400,height=900");

        if (!printWindow) return;
        const metodeName = `TENDER/SELEKSI TAHUN ANGGARAN ${tahun ? tahun : tahunOptions[tahunOptions.length - 1].text
            }`;
        const totals = calculateTotals();

        const tableRows = dataEntryFilter.map((row, index) => `
            <tr>
                <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${index + 1}</td>
                <td style="border: 1px solid #000; padding: 4px 3px;">${row.user?.fullname || ""}</td>
                <td style="border: 1px solid #000; padding: 4px 3px;">${row.user?.opd_organization || ""}</td>
                <td style="border: 1px solid #000; padding: 4px 3px;">${row.nama_paket || ""}</td>
                <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.metode_pengadaan || ""}</td>
                <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_pagu}</td>
                <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_hps}</td>
                <td style="border: 1px solid #000; padding: 4px 3px;">${row.pemenang || ""}</td>
                <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_penawaran}</td>
                <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_negosiasi}</td>
                <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.nomor_kontrak}</td>
                <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.nilai_kontrak}</td>
                <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.efisiensi}</td>
                <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.presentase || ""}</td>
            </tr>
        `).join("");

        printWindow.document.write(`
        <html>
            <head>
                <title>Laporan Pengadaan</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 0.5cm;
                    }
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        padding: 15px;
                        font-size: 11px;
                    }
                    
                    .header-section {
                        margin-bottom: 15px;
                    }
                    
                    .title {
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 3px;
                    }
                    
                    .subtitle {
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 15px;
                    }
                    
                    .info-table {
                        width: 100%;
                        margin-bottom: 15px;
                        border-collapse: collapse;
                    }
                    
                    .info-table td {
                        padding: 3px 0;
                        font-size: 11px;
                        vertical-align: top;
                    }
                    
                    .info-table td:first-child {
                        width: 200px;
                        font-weight: normal;
                    }
                    
                    .info-table td:nth-child(2) {
                        width: 20px;
                        text-align: center;
                    }
                    
                    .info-table td:last-child {
                        font-weight: normal;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 9px;
                    }
                    
                    th {
                        background-color: #ff6600;
                        color: white;
                        border: 1px solid #000;
                        padding: 6px 4px;
                        text-align: center;
                        vertical-align: middle;
                        font-weight: bold;
                        font-size: 9px;
                    }
                    
                    td {
                        border: 1px solid #000;
                        padding: 4px 3px;
                        vertical-align: top;
                        font-size: 9px;
                    }
                    
                    .footer-row td {
                        background-color: #FFE6CC;
                        font-weight: bold;
                        border: 1px solid #000;
                    }
                    
                    @media print {
                        body {
                            padding: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header-section">
                    <div class="title">DAFTAR PAKET PROSES PEMILIHAN PENYEDIA BARANG/JASA</div>
                    <div class="subtitle">MELALUI ${metodeName.toUpperCase()}</div>                
                </div>
                
                <table>
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col.label}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                        <tr class="footer-row">
                            <td colspan="4" style="text-align: center; font-weight: bold;">JUMLAH</td>
                            <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_pagu)}</td>
                            <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_hps)}</td>
                            <td></td>
                            <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_penawaran)}</td>
                            <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_negosiasi)}</td>
                            <td></td>
                            <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.efisiensi)}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handleSavePDF = () => {
        const metodeName = `TENDER/SELEKSI TAHUN ANGGARAN ${tahun ? tahun : tahunOptions[tahunOptions.length - 1].text
            }`;
        const totals = calculateTotals();

        const tableRows = dataEntryFilter.map((row, index) => `
        <tr>
            <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${index + 1}</td>
            <td style="border: 1px solid #000; padding: 4px 3px;">${row.user?.fullname || ""}</td>
            <td style="border: 1px solid #000; padding: 4px 3px;">${row.user?.opd_organization || ""}</td>
            <td style="border: 1px solid #000; padding: 4px 3px;">${row.nama_paket || ""}</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.metode_pengadaan || ""}</td>
            <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_pagu}</td>
            <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_hps}</td>
            <td style="border: 1px solid #000; padding: 4px 3px;">${row.pemenang || ""}</td>
            <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_penawaran}</td>
            <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.nilai_negosiasi}</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.nomor_kontrak}</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.nilai_kontrak}</td>
            <td style="text-align: right; border: 1px solid #000; padding: 4px 3px;">${row.efisiensi}</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px 3px;">${row.presentase || ""}</td>
        </tr>
    `).join("");

        const element = document.createElement("div");

        element.innerHTML = `
    <style>
        @page {
            size: A4 landscape;
            margin: 0.5cm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            padding: 15px;
            font-size: 11px;
        }
        
        .header-section {
            margin-bottom: 15px;
        }
        
        .title {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 3px;
        }
        
        .subtitle {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
        }
        
        .info-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        
        .info-table td {
            padding: 3px 0;
            font-size: 11px;
            vertical-align: top;
        }
        
        .info-table td:first-child {
            width: 200px;
            font-weight: normal;
        }
        
        .info-table td:nth-child(2) {
            width: 20px;
            text-align: center;
        }
        
        .info-table td:last-child {
            font-weight: normal;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
        }
        
        th {
            background-color: #ff6600;
            color: white;
            border: 1px solid #000;
            padding: 6px 4px;
            text-align: center;
            vertical-align: middle;
            font-weight: bold;
            font-size: 9px;
        }
        
        td {
            border: 1px solid #000;
            padding: 4px 3px;
            vertical-align: top;
            font-size: 9px;
        }
        
        .footer-row td {
            background-color: #FFE6CC;
            font-weight: bold;
            border: 1px solid #000;
        }
    </style>
    
    <div class="header-section">
        <div class="title">DAFTAR PAKET PROSES PEMILIHAN PENYEDIA BARANG/JASA</div>
        <div class="subtitle">MELALUI ${metodeName.toUpperCase()}</div>
    </div>
    
    <table>
        <thead>
            <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${tableRows}
            <tr class="footer-row">
                <td colspan="4" style="text-align: center; font-weight: bold;">JUMLAH</td>
                <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_pagu)}</td>
                <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_hps)}</td>
                <td></td>
                <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_penawaran)}</td>
                <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.nilai_negosiasi)}</td>
                <td></td>
                <td style="text-align: right; font-weight: bold;">${FormatRupiah(totals.efisiensi)}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    `;

        html2pdf()
            .set({
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `laporan-pengadaan-kelompok-kerja-${tahun || 'semua'}.pdf`,
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: {
                    unit: "cm",
                    format: "a4",
                    orientation: "landscape",
                },
            })
            .from(element)
            .save();
    };

    const handleSaveExcel = () => {
        const XLSX_UTILS = XLSX.utils;
        const workbook = XLSX.utils.book_new();
        const metodeName = `TENDER/SELEKSI TAHUN ANGGARAN ${tahun ? tahun : tahunOptions[tahunOptions.length - 1].text
            }`;
        const totals = calculateTotals();

        const headerData = [
            ["DAFTAR PAKET PROSES PEMILIHAN PENYEDIA BARANG/JASA"],
            [`MELALUI ${metodeName.toUpperCase()}`],
            [""],
            columns.map(col => col.label),
            ...dataEntryFilter.map((row, index) =>
                columns.map(col => {
                    if (col.key === 'id') return index + 1;
                    const value = (row as Record<string, any>)[col.key];
                    return value ?? "";
                })
            ),
            [
                "JUMLAH",
                "",
                "",
                "",
                FormatRupiah(totals.nilai_pagu),
                FormatRupiah(totals.nilai_hps),
                "",
                FormatRupiah(totals.nilai_penawaran),
                FormatRupiah(totals.nilai_negosiasi),
                "",
                FormatRupiah(totals.efisiensi),
                "",
                "",
                ""
            ]
        ];

        const worksheet = XLSX_UTILS.aoa_to_sheet(headerData);

        const range = XLSX_UTILS.decode_range(worksheet["!ref"]!);
        const numCols = columns.length;

        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } },
            { s: { r: headerData.length - 1, c: 0 }, e: { r: headerData.length - 1, c: 3 } }
        ];

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX_UTILS.encode_cell({ r: R, c: C });
                if (!worksheet[cellRef]) continue;

                const isHeaderRow = R === 0 || R === 1;
                const isInfoRow = R >= 3 && R <= 5;
                const isTableHeader = R === 3;
                const isTableData = R > 3 && R < headerData.length - 1;
                const isFooterRow = R === headerData.length - 1;

                let alignment = {
                    vertical: "center",
                    wrapText: true,
                } as any;

                if (isHeaderRow) {
                    alignment.horizontal = "center";
                } else if (isTableHeader) {
                    alignment.horizontal = "center";
                } else if (isTableData || isFooterRow) {
                    if (C === 0 || C === 3) {
                        alignment.horizontal = "center";
                    } else if ([4, 5, 7, 8, 10].includes(C)) {
                        alignment.horizontal = "right";
                    } else {
                        alignment.horizontal = "left";
                    }
                } else if (isInfoRow && C === 0) {
                    alignment.horizontal = "left";
                }

                const numberFormat = ([4, 5, 7, 8, 10].includes(C) && (isTableData || isFooterRow))
                    ? "#,##0.00"
                    : undefined;

                const borderStyle = (isTableHeader || isTableData || isFooterRow) ? {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                } : undefined;

                let fillColor = undefined;
                let fontColor = undefined;

                if (isTableHeader) {
                    fillColor = { patternType: "solid", fgColor: { rgb: "FF6600" } };
                    fontColor = { rgb: "FFFFFF" };
                } else if (isFooterRow) {
                    fillColor = { patternType: "solid", fgColor: { rgb: "FFE6CC" } };
                }

                worksheet[cellRef].s = {
                    font: {
                        name: "Arial",
                        sz: isHeaderRow ? 14 : isTableHeader ? 11 : 11,
                        bold: isHeaderRow || isTableHeader || isFooterRow,
                        color: fontColor
                    },
                    alignment: alignment,
                    border: borderStyle,
                    fill: fillColor,
                    numFmt: numberFormat
                };
            }
        }

        worksheet["!cols"] = [
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
        ];

        worksheet["!rows"] = Array.from({ length: headerData.length }, () => ({
            hpt: 50
        }));

        XLSX_UTILS.book_append_sheet(workbook, worksheet, "Laporan Pengadaan");

        XLSX.writeFile(workbook, `laporan-pengadaan-kelompok-kerja-${tahun || 'semua'}.xlsx`);
    };

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || (user.role.name != "kepala biro" && user.role.name != "kepala bagian")) {
        return <Navigate to="/" replace />
    }

    return (
        <div>
            <Navbar />

            <div className="pt-24" data-aos="fade-up" data-aos-duration="1000">
                <TableHeaderReport
                    title="DAFTAR PAKET PROSES PEMILIHAN PENYEDIA BARANG/JASA KELOMPOK KERJA"
                    tahunOptions={tahunOptions}
                    metodePengadaanOptions={metodeOptionsFilter}
                    sumberDanaOptions={sumberDanaOptions}
                    selectedTahun={tahun}
                    selectedMetodePengadaan={metodePengadaan}
                    selectedSumberDana={sumberDana}
                    onTahunChange={setTahun}
                    onMetodePengadaanChange={setMetodePengadaan}
                    onSumberDanaChange={setSumberDana}
                    onKelompokChange={setKelompokKerja}
                    kelompokOptions={groupOptions}
                    selectedKelompok={kelompokKerja}
                    isKepala={true}
                    isKelompok={true}
                    onPrint={() => handlePrint()}
                    onSavePDF={() => handleSavePDF()}
                    onSaveExcel={() => handleSaveExcel()}
                />
                <div className="p-6" ref={tableRef}>
                    <TableContent
                        columns={columns}
                        data={dataEntryFilter}
                        isSelect={false}
                        showEdit={false}
                        showPreview={false}
                        idKey="id"
                    />
                </div>
            </div>
        </div>
    )
}