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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    selectedRealization: RealizationProps[]
}

export default function LineChart({ selectedRealization }: LineChartProps) {
    const latestRealization = selectedRealization?.[selectedRealization.length - 1];
    const scheduleAggreateWeeks = ScheduleWeekAggregate(latestRealization?.schedule.items ?? []);

    const plannedValue = PlannedProgressUntilWeek(scheduleAggreateWeeks, String(latestRealization?.schedule?.tanggal_mulai));
    const totalPlanned = RemainingProgress(scheduleAggreateWeeks);
    const scheduleProgress = ConvertToPercent(plannedValue, totalPlanned);
    const actualProgress = ConvertToPercent(RemainingProgress(latestRealization?.detail), RemainingProgress(scheduleAggreateWeeks)) ?? 0;
    const kurvaData = buildKurvaData(latestRealization?.schedule, latestRealization as any);
    const deviation = actualProgress - scheduleProgress;
    const isAhead = deviation >= 0;

    return (
        <div className="w-full lg:h-screen h-auto flex items-center p-4 lg:p-8 my-24 lg:my-36 " data-aos="fade-up" data-aos-duration="1000">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-linear-to-r from-hover to-blue-100 rounded-full mb-3">
                        <BarChart3 className="h-3.5 w-3.5 text-secondary" />
                        <span className="text-xs font-poppins-semibold text-gray-700">Analisis Progress</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-poppins-bold bg-linear-to-r from-secondary via-third to-blue-500 bg-clip-text text-transparent mb-2">
                        Grafik Progress Pekerjaan
                    </h1>
                    <p className="text-gray-600 text-sm font-poppins-regular max-w-2xl mx-auto">
                        Visualisasi perbandingan progress rencana dan aktual secara real-time
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-hover mb-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-1 h-6 bg-linear-to-b from-third to-blue-500 rounded-full"></div>
                        <h2 className="text-lg font-poppins-bold text-gray-800 flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-third" />
                            <span>Kurva Progress</span>
                        </h2>
                    </div>

                    <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-inner mb-4">
                        <div className="h-56 sm:h-64">
                            <Line
                                data={{
                                    labels: kurvaData.map(d => `Minggu ke-${d.minggu}`),
                                    datasets: [
                                        {
                                            label: 'Rencana',
                                            data: kurvaData.map(d => ConvertToPercent(d.rencana, RemainingProgress(scheduleAggreateWeeks))),
                                            borderColor: '#f60',
                                            backgroundColor: 'rgba(255,102,0,0.1)',
                                            borderWidth: 3,
                                            pointRadius: 6,
                                            pointBackgroundColor: '#f60',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 3,
                                            pointHoverRadius: 9,
                                            pointHoverBorderWidth: 4,
                                            tension: 0.4,
                                            fill: true,
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        return `${context.dataset.label}: ${context.parsed.y}%`;
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            label: 'Aktual',
                                            data: kurvaData.map(d => ConvertToPercent(d.aktual, RemainingProgress(scheduleAggreateWeeks))),
                                            borderColor: '#3b82f6',
                                            backgroundColor: 'rgba(59,130,246,0.1)',
                                            borderWidth: 3,
                                            pointRadius: 6,
                                            pointBackgroundColor: '#3b82f6',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 3,
                                            pointHoverRadius: 9,
                                            pointHoverBorderWidth: 4,
                                            tension: 0.4,
                                            fill: true,
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        return `${context.dataset.label}: ${context.parsed.y}%`;
                                                    }
                                                }
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
                                                font: { family: 'poppins-semibold', size: 12 },
                                                padding: 15,
                                                usePointStyle: true,
                                                pointStyle: 'circle',
                                                color: '#374151'
                                            }
                                        },
                                        tooltip: {
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderColor: '#f60',
                                            borderWidth: 2,
                                            titleFont: { family: 'poppins-semibold', size: 12 },
                                            bodyFont: { family: 'poppins-regular', size: 11 },
                                            padding: 12,
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
                                                callback: function (value) {
                                                    return value + '%';
                                                }
                                            },
                                            grid: {
                                                color: '#e5e7eb'
                                            },
                                            border: {
                                                display: false
                                            }
                                        },
                                        x: {
                                            ticks: {
                                                font: { family: 'poppins-medium', size: 10 },
                                                color: '#6b7280'
                                            },
                                            grid: {
                                                display: false
                                            },
                                            border: {
                                                display: false
                                            }
                                        }
                                    },
                                    interaction: {
                                        intersect: false,
                                        mode: 'index'
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4  ">
                        <div className="bg-linear-to-br from-third to-secondary rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-poppins-medium text-sm opacity-90">Rencana</p>
                                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="font-poppins-bold text-3xl">{scheduleProgress.toFixed(1)}%</p>
                        </div>

                        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-poppins-medium text-sm opacity-90">Aktual</p>
                                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Activity className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="font-poppins-bold text-3xl">{actualProgress.toFixed(1)}%</p>
                        </div>

                        <div className={`bg-linear-to-br ${isAhead ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-poppins-medium text-sm opacity-90">Deviasi</p>
                                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className={`h-4 w-4 ${isAhead ? '' : 'rotate-180'}`} />
                                </div>
                            </div>
                            <p className="font-poppins-bold text-3xl">{isAhead ? '+' : ''}{deviation.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-hover hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-10 h-10 bg-linear-to-br from-third to-secondary rounded-lg flex items-center justify-center shadow-lg">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-poppins-medium text-xs text-gray-600">Sisa Waktu</p>
                                <p className="font-poppins-bold text-lg text-gray-800">
                                    {latestRealization ? RemainingWeeks(
                                        String(latestRealization?.schedule?.tanggal_mulai),
                                        String(latestRealization?.schedule?.tanggal_akhir)
                                    ) : 0} <span className="text-sm">Minggu</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-third to-secondary rounded-full animate-pulse" style={{ width: `${scheduleProgress}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-blue-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-poppins-medium text-xs text-gray-600">Total Durasi</p>
                                <p className="font-poppins-bold text-lg text-gray-800">
                                    {latestRealization ? TotalWeek(
                                        String(latestRealization?.schedule?.tanggal_mulai),
                                        String(latestRealization?.schedule?.tanggal_akhir)
                                    ) : 0} <span className="text-sm">Minggu</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-purple-100 lg:row-span-2 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-1 h-6 bg-linear-to-b from-purple-500 to-purple-600 rounded-full"></div>
                            <h3 className="font-poppins-bold text-base text-gray-800 flex items-center space-x-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                <span>Detail Progress</span>
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-linear-to-br from-hover to-hover/50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-poppins-semibold text-xs text-gray-700">Progress Perencanaan</p>
                                    <span className="font-poppins-bold text-base text-secondary">{scheduleProgress.toFixed(1)}%</span>
                                </div>
                                <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 bg-linear-to-r from-third to-secondary rounded-full transition-all duration-500" style={{ width: `${scheduleProgress}%` }}></div>
                                </div>
                            </div>

                            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-poppins-semibold text-xs text-gray-700">Progres Aktual</p>
                                    <span className="font-poppins-bold text-base text-blue-600">{actualProgress.toFixed(1)}%</span>
                                </div>
                                <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${actualProgress}%` }}></div>
                                </div>
                            </div>

                            <div className={`bg-linear-to-br ${isAhead ? 'from-green-50 to-green-100/50' : 'from-red-50 to-red-100/50'} rounded-lg p-3`}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-poppins-semibold text-xs text-gray-700">Selisih Progress</p>
                                    <span className={`font-poppins-bold text-base ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
                                        {isAhead ? '+' : ''}{deviation.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div className={`absolute inset-0 bg-linear-to-r ${isAhead ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} rounded-full transition-all duration-500`} style={{ width: `${Math.abs(deviation)}%` }}></div>
                                </div>
                                <p className={`text-xs font-poppins-medium mt-1.5 ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
                                    {isAhead ? '✓ Progress di atas rencana' : '✗ Progress di bawah rencana'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 lg:col-span-2 border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                            <h3 className="font-poppins-bold text-base text-gray-800">Jadwal Pelaksanaan</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-9 h-9 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="font-poppins-semibold text-xs text-gray-700">Tanggal Mulai</p>
                                </div>
                                <p className="font-poppins-bold text-sm text-gray-800 ml-11">
                                    {latestRealization ? FormatDate(String(latestRealization?.schedule?.tanggal_mulai)) : "Belum Ada Data"}
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-red-50 to-red-100/50 rounded-lg p-3 border border-red-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-9 h-9 bg-linear-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="font-poppins-semibold text-xs text-gray-700">Tanggal Selesai</p>
                                </div>
                                <p className="font-poppins-bold text-sm text-gray-800 ml-11">
                                    {latestRealization ? FormatDate(String(latestRealization?.schedule?.tanggal_akhir)) : "Belum Ada Data"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
            `}</style>
        </div>
    );
}