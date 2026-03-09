/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RemainingWeeks } from '../utils/RemainingWeek';
import { TotalWeek } from '../utils/TotalWeek';
import { FormatDate } from '../utils/FormatDate';
import { ScheduleWeekAggregate } from '../utils/ScheduleWeekAggregate';
import { RemainingProgress } from '../utils/RemainingProgress';
import { ConvertToPercent } from '../utils/CovertToPercent';
import { buildKurvaData } from '../utils/BuildKurvaData';
import { TrendingUp, Calendar, Clock, Activity, BarChart3, Sparkles } from 'lucide-react';
import { PlannedProgressUntilWeek } from '../utils/PlannedProgressUntilWeek';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
    selectedRealization: RealizationProps[]
}

export default function LineChart({ selectedRealization }: LineChartProps) {
    const latestRealization = selectedRealization?.[selectedRealization.length - 1];
    const scheduleAggreateWeeks = ScheduleWeekAggregate(latestRealization?.schedule.items ?? []);

    const plannedValue = PlannedProgressUntilWeek(scheduleAggreateWeeks, String(latestRealization?.schedule?.tanggal_mulai));
    const totalPlanned = RemainingProgress(scheduleAggreateWeeks);
    const scheduleProgress = ConvertToPercent(plannedValue, totalPlanned);
    const actualProgress = ConvertToPercent(RemainingProgress(latestRealization?.details), RemainingProgress(scheduleAggreateWeeks)) ?? 0;
    const kurvaData = buildKurvaData(latestRealization?.schedule, latestRealization as any);
    const deviation = actualProgress - scheduleProgress;
    const isAhead = deviation >= 0;

    return (
        <div
            className="w-full min-h-screen"
            data-aos="fade-up"
            data-aos-duration="1000"
        >
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-10 sm:pb-16">

                {/* Header */}
                <div className="text-center mb-5 sm:mb-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary/40 rounded-full mb-3">
                        <BarChart3 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-poppins-semibold text-primary">Analisis Progress</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins-bold bg-linear-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent mb-2 leading-tight">
                        Grafik Progress Pekerjaan
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base font-poppins-regular max-w-2xl mx-auto">
                        Visualisasi perbandingan progress rencana dan aktual secara real-time
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-hover mb-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-1 h-6 bg-linear-to-b from-third to-blue-500 rounded-full shrink-0"></div>
                        <h2 className="text-base sm:text-lg font-poppins-bold text-gray-800 flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-third shrink-0" />
                            <span>Kurva Progress</span>
                        </h2>
                    </div>

                    <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-inner mb-4">
                        <div className="h-52 sm:h-64 md:h-72">
                            <Line
                                data={{
                                    labels: kurvaData.map(d => `Minggu ke-${d.minggu}`),
                                    datasets: [
                                        {
                                            label: 'Rencana',
                                            data: kurvaData.map(d => ConvertToPercent(d.rencana, RemainingProgress(scheduleAggreateWeeks))),
                                            borderColor: '#f60',
                                            backgroundColor: 'rgba(255,102,0,0.1)',
                                            borderWidth: 2.5,
                                            pointRadius: 4,
                                            pointBackgroundColor: '#f60',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                            pointHoverRadius: 7,
                                            pointHoverBorderWidth: 3,
                                            tension: 0.4,
                                            fill: true,
                                            tooltip: {
                                                callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` }
                                            }
                                        },
                                        {
                                            label: 'Aktual',
                                            data: kurvaData.map(d => ConvertToPercent(d.aktual, RemainingProgress(scheduleAggreateWeeks))),
                                            borderColor: '#3b82f6',
                                            backgroundColor: 'rgba(59,130,246,0.1)',
                                            borderWidth: 2.5,
                                            pointRadius: 4,
                                            pointBackgroundColor: '#3b82f6',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                            pointHoverRadius: 7,
                                            pointHoverBorderWidth: 3,
                                            tension: 0.4,
                                            fill: true,
                                            tooltip: {
                                                callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` }
                                            }
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                            labels: {
                                                font: { family: 'poppins-semibold', size: 11 },
                                                padding: 12,
                                                usePointStyle: true,
                                                pointStyle: 'circle',
                                                color: '#374151'
                                            }
                                        },
                                        tooltip: {
                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                            borderColor: '#f60',
                                            borderWidth: 2,
                                            titleFont: { family: 'poppins-semibold', size: 12 },
                                            bodyFont: { family: 'poppins-regular', size: 11 },
                                            padding: 10,
                                            displayColors: true,
                                            cornerRadius: 10,
                                            titleColor: '#111827',
                                            bodyColor: '#374151',
                                            boxPadding: 4
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                font: { family: 'poppins-medium', size: 10 },
                                                color: '#6b7280',
                                                callback: (value) => value + '%',
                                                maxTicksLimit: 6
                                            },
                                            grid: { color: '#e5e7eb' },
                                            border: { display: false }
                                        },
                                        x: {
                                            ticks: {
                                                font: { family: 'poppins-medium', size: 9 },
                                                color: '#6b7280',
                                                maxRotation: 45,
                                                minRotation: 0,
                                                autoSkip: true,
                                                maxTicksLimit: 8
                                            },
                                            grid: { display: false },
                                            border: { display: false }
                                        }
                                    },
                                    interaction: { intersect: false, mode: 'index' }
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-0">
                        <div className="bg-linear-to-br from-primary to-secondary rounded-xl p-3 sm:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <p className="font-poppins-medium text-xs sm:text-sm opacity-90">Rencana</p>
                                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                    <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </div>
                            </div>
                            <p className="font-poppins-bold text-xl sm:text-2xl md:text-3xl leading-tight">{scheduleProgress.toFixed(1)}%</p>
                        </div>

                        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-3 sm:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <p className="font-poppins-medium text-xs sm:text-sm opacity-90">Aktual</p>
                                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </div>
                            </div>
                            <p className="font-poppins-bold text-xl sm:text-2xl md:text-3xl leading-tight">{actualProgress.toFixed(1)}%</p>
                        </div>

                        <div className={`bg-linear-to-br ${isAhead ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl p-3 sm:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <p className="font-poppins-medium text-xs sm:text-sm opacity-90">Deviasi</p>
                                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                    <TrendingUp className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isAhead ? '' : 'rotate-180'}`} />
                                </div>
                            </div>
                            <p className="font-poppins-bold text-xl sm:text-2xl md:text-3xl leading-tight">
                                {isAhead ? '+' : ''}{deviation.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-hover hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-third to-secondary rounded-lg flex items-center justify-center shadow-lg shrink-0">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-poppins-medium text-xs text-gray-500">Sisa Waktu</p>
                                <p className="font-poppins-bold text-base sm:text-lg text-gray-800 leading-tight">
                                    {latestRealization ? RemainingWeeks(
                                        String(latestRealization?.schedule?.tanggal_mulai),
                                        String(latestRealization?.schedule?.tanggal_akhir)
                                    ) : 0}
                                    <span className="text-xs sm:text-sm font-poppins-regular text-gray-500 ml-1">Minggu</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-third to-secondary rounded-full animate-pulse transition-all duration-500" style={{ width: `${scheduleProgress}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-blue-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shrink-0">
                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-poppins-medium text-xs text-gray-500">Total Durasi</p>
                                <p className="font-poppins-bold text-base sm:text-lg text-gray-800 leading-tight">
                                    {latestRealization ? TotalWeek(
                                        String(latestRealization?.schedule?.tanggal_mulai),
                                        String(latestRealization?.schedule?.tanggal_akhir)
                                    ) : 0}
                                    <span className="text-xs sm:text-sm font-poppins-regular text-gray-500 ml-1">Minggu</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-purple-100 sm:col-span-2 lg:col-span-1 lg:row-span-2 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-1 h-6 bg-linear-to-b from-purple-500 to-purple-600 rounded-full shrink-0"></div>
                            <h3 className="font-poppins-bold text-sm sm:text-base text-gray-800 flex items-center space-x-2">
                                <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                                <span>Detail Progress</span>
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-linear-to-br from-hover/30 to-hover/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-poppins-semibold text-xs text-gray-700">Progress Perencanaan</p>
                                    <span className="font-poppins-bold text-sm sm:text-base text-primary">{scheduleProgress.toFixed(1)}%</span>
                                </div>
                                <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 bg-primary rounded-full transition-all duration-500" style={{ width: `${scheduleProgress}%` }}></div>
                                </div>
                            </div>

                            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-poppins-semibold text-xs text-gray-700">Progres Aktual</p>
                                    <span className="font-poppins-bold text-sm sm:text-base text-blue-600">{actualProgress.toFixed(1)}%</span>
                                </div>
                                <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${actualProgress}%` }}></div>
                                </div>
                            </div>

                            <div className={`bg-linear-to-br ${isAhead ? 'from-green-50 to-green-100/50' : 'from-red-50 to-red-100/50'} rounded-lg p-3`}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-poppins-semibold text-xs text-gray-700">Selisih Progress</p>
                                    <span className={`font-poppins-bold text-sm sm:text-base ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
                                        {isAhead ? '+' : ''}{deviation.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`absolute inset-0 bg-linear-to-r ${isAhead ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} rounded-full transition-all duration-500`}
                                        style={{ width: `${Math.abs(deviation)}%` }}
                                    ></div>
                                </div>
                                <p className={`text-xs font-poppins-medium mt-1.5 ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
                                    {isAhead ? '✓ Progress di atas rencana' : '✗ Progress di bawah rencana'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:col-span-2 lg:col-span-2 border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded-full shrink-0"></div>
                            <h3 className="font-poppins-bold text-sm sm:text-base text-gray-800">Jadwal Pelaksanaan</h3>
                        </div>
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                    </div>
                                    <p className="font-poppins-semibold text-xs text-gray-600">Tanggal Mulai</p>
                                </div>
                                <p className="font-poppins-bold text-sm text-gray-800 pl-10 sm:pl-11">
                                    {latestRealization ? FormatDate(String(latestRealization?.schedule?.tanggal_mulai)) : "Belum Ada Data"}
                                </p>
                            </div>

                            <div className="bg-linear-to-br from-red-50 to-red-100/50 rounded-lg p-3 border border-red-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                    </div>
                                    <p className="font-poppins-semibold text-xs text-gray-600">Tanggal Selesai</p>
                                </div>
                                <p className="font-poppins-bold text-sm text-gray-800 pl-10 sm:pl-11">
                                    {latestRealization ? FormatDate(String(latestRealization?.schedule?.tanggal_akhir)) : "Belum Ada Data"}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}