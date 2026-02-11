/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import logo from "/image/logo/logo.png";

interface ApiConfig {
  apiKey: string;
  baseUrl: string;
}

interface TahunItem {
  text: string;
}

interface TahunFormData {
  text: string;
}

export default function Konfigurasi() {
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    apiKey: '',
    baseUrl: ''
  });
  const [isApiSaved, setIsApiSaved] = useState(false);
  const [tahunList, setTahunList] = useState<TahunItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTahunModal, setShowTahunModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteApiModal, setShowDeleteApiModal] = useState(false);
  const [tahunFormData, setTahunFormData] = useState<TahunFormData>({
    text: '',
  });

  useEffect(() => {
    const savedApiConfig = localStorage.getItem('apiConfig');
    if (savedApiConfig) {
      try {
        const parsed = JSON.parse(savedApiConfig) as ApiConfig;
        setApiConfig(parsed);
        setIsApiSaved(true);
      } catch (e) {
        console.error(e)
      }
    }

    const savedTahun = localStorage.getItem('tahunAnggaran');
    if (savedTahun) {
      try {
        let parsed = JSON.parse(savedTahun);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].tahun !== undefined) {
          parsed = parsed.map((item: any) => ({ text: item.tahun.toString() }));
        }
        setTahunList(parsed as TahunItem[]);
      } catch (e) {
        console.error(e)
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tahunAnggaran', JSON.stringify(tahunList));
  }, [tahunList]);

  const saveApiConfig = () => {
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
    setIsApiSaved(true);
  };

  const handleApiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiConfig(prev => ({
      ...prev,
      [name]: value
    }));
    setIsApiSaved(false);
  };

  const handleApiSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveApiConfig();
  };

  const deleteApiConfig = () => {
    setApiConfig({
      apiKey: '',
      baseUrl: ''
    });
    setIsApiSaved(false);
    localStorage.removeItem('apiConfig');
    setShowDeleteApiModal(false);
  };

  const handleTahunInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTahunFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTahunSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newTahun = tahunFormData.text.trim();
    if (!newTahun) return;

    if (editMode && currentText) {
      if (newTahun !== currentText && tahunList.some(item => item.text === newTahun)) {
        alert('Tahun anggaran sudah ada');
        return;
      }
      setTahunList(prev => 
        prev.map(item => 
          item.text === currentText ? { text: newTahun } : item
        )
      );
    } else {
      if (tahunList.some(item => item.text === newTahun)) {
        alert('Tahun anggaran sudah ada');
        return;
      }
      setTahunList(prev => [...prev, { text: newTahun }]);
    }
    
    closeTahunModal();
  };

  const openAddTahunModal = () => {
    setTahunFormData({ text: '' });
    setEditMode(false);
    setCurrentText(null);
    setShowTahunModal(true);
  };

  const openEditTahunModal = (item: TahunItem) => {
    setTahunFormData({ text: item.text });
    setCurrentText(item.text);
    setEditMode(true);
    setShowTahunModal(true);
  };

  const closeTahunModal = () => {
    setShowTahunModal(false);
    setTahunFormData({ text: '' });
    setEditMode(false);
    setCurrentText(null);
  };

  const openDeleteTahunModal = (text: string) => {
    setDeleteText(text);
    setShowDeleteModal(true);
  };

  const confirmDeleteTahun = () => {
    if (deleteText !== null) {
      setTahunList(prev => prev.filter(item => item.text !== deleteText));
    }
    setShowDeleteModal(false);
    setDeleteText(null);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setTahunList(prev => prev.filter(item => !selectedItems.includes(item.text)));
    setSelectedItems([]);
  };

  const toggleSelectItem = (text: string) => {
    setSelectedItems(prev => 
      prev.includes(text) 
        ? prev.filter(item => item !== text)
        : [...prev, text]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.text));
    }
  };

  const filteredData = tahunList.filter(item =>
    item.text.includes(searchTerm)
  );

  const handleBackToWebsite = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins-regular">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-poppins-bold text-xl">
                MONEV <span className="text-secondary">PROJECT</span>
              </span>
            </div>
            <button
              onClick={handleBackToWebsite}
              className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-third text-secondary rounded-lg font-poppins-medium hover:bg-hover transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali Ke Website
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-poppins-bold text-gray-800">
            Konfigurasi Website Monev
          </h1>
          <button
            onClick={handleBackToWebsite}
            className="flex md:hidden items-center gap-2 px-4 py-2 border-2 border-third text-secondary rounded-lg font-poppins-medium hover:bg-hover transition-all duration-200 w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali Ke Website
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-third to-secondary px-6 py-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-poppins-bold text-white">Konfigurasi API</h2>
                  <p className="text-hover text-xs font-poppins-regular mt-0.5">Atur koneksi API ke sistem Monalisa</p>
                </div>
              </div>
              {isApiSaved && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-poppins-medium text-white">Tersimpan</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleApiSubmit} className="p-8" data-aos="fade-up" data-aos-duration="1000">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-poppins-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  API Key
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-third transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="apiKey"
                    value={apiConfig.apiKey}
                    onChange={handleApiInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl font-poppins-regular
                      focus:border-third focus:ring-4 focus:ring-hover outline-none
                      transition-all duration-300 hover:border-gray-300
                      bg-linear-to-br from-white to-gray-50"
                    placeholder="Masukkan API Key Anda"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-poppins-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Base URL
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-third transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="baseUrl"
                    value={apiConfig.baseUrl}
                    onChange={handleApiInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl font-poppins-regular
                      focus:border-third focus:ring-4 focus:ring-hover outline-none
                      transition-all duration-300 hover:border-gray-300
                      bg-linear-to-br from-white to-gray-50"
                    placeholder="https://api.monalisa.example.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-third" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-poppins-regular">Konfigurasi ini akan terhubung ke sistem Monalisa</span>
              </div>
              <div className="flex gap-3">
                {isApiSaved && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteApiModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-poppins-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!apiConfig.apiKey || !apiConfig.baseUrl}
                  className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-third to-secondary hover:from-secondary hover:to-secondary text-white rounded-lg font-poppins-semibold transition-all duration-200 shadow-lg shadow-hover hover:shadow-xl hover:shadow-third disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-hover"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {isApiSaved ? 'Update Konfigurasi' : 'Simpan Konfigurasi'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-third to-secondary px-6 py-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-poppins-bold text-white">Daftar Tahun Anggaran</h2>
                <p className="text-hover text-xs font-poppins-regular mt-0.5">Kelola tahun anggaran untuk monitoring</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari tahun..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-third focus:ring-4 focus:ring-hover font-poppins-regular transition-all duration-300 bg-linear-to-br from-white to-gray-50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={openAddTahunModal}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-third to-secondary hover:from-secondary hover:to-secondary text-white rounded-xl font-poppins-semibold transition-all duration-200 shadow-lg shadow-hover hover:shadow-xl hover:shadow-third"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Tambah</span>
                </button>
                
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-poppins-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Hapus ({selectedItems.length})</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-hover to-amber-50 border-b border-hover">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-third focus:ring-2"
                      />
                    </th>
                    <th className="px-6 py-4 text-left font-poppins-bold text-sm text-gray-800 uppercase tracking-wide">No</th>
                    <th className="px-6 py-4 text-left font-poppins-bold text-sm text-gray-800 uppercase tracking-wide">Tahun</th>
                    <th className="px-6 py-4 text-center font-poppins-bold text-sm text-gray-800 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-linear-to-br from-hover to-amber-100 rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-third" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-lg font-poppins-semibold text-gray-700 mb-1">Belum Ada Data</p>
                            <p className="text-sm font-poppins-regular text-gray-500">Silakan tambahkan tahun anggaran baru</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr key={item.text} className="hover:bg-linear-to-r hover:from-hover/50 hover:to-transparent transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.text)}
                            onChange={() => toggleSelectItem(item.text)}
                            className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-third focus:ring-2"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-poppins-medium text-gray-600">{index + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-br from-third to-secondary rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-poppins-semibold text-gray-800 text-lg">{item.text}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditTahunModal(item)}
                              className="flex items-center gap-1.5 px-3 py-2 text-secondary hover:bg-hover rounded-lg font-poppins-semibold text-sm transition-all duration-150 border border-transparent hover:border-hover"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Ubah
                            </button>
                            <button
                              onClick={() => openDeleteTahunModal(item.text)}
                              className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-poppins-semibold text-sm transition-all duration-150 border border-transparent hover:border-red-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredData.length > 0 && (
              <div className="mt-5 flex items-center justify-between text-sm text-gray-600 font-poppins-regular bg-linear-to-r from-hover to-amber-50 px-4 py-3 rounded-lg border border-hover">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Menampilkan <span className="font-poppins-semibold text-gray-800">{filteredData.length}</span> dari <span className="font-poppins-semibold text-gray-800">{tahunList.length}</span> data</span>
                </div>
                {selectedItems.length > 0 && (
                  <span className="text-secondary font-poppins-semibold">
                    {selectedItems.length} item terpilih
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteApiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-gray-100">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-poppins-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
                  <p className="text-sm font-poppins-regular text-gray-600 leading-relaxed">
                    Apakah Anda yakin ingin menghapus konfigurasi API ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteApiModal(false)}
                  className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-poppins-semibold transition-all duration-200 hover:border-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={deleteApiConfig}
                  className="flex-1 px-5 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-poppins-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTahunModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 border border-gray-100">
            <div className="bg-linear-to-r from-third via-secondary to-amber-500 px-6 py-5 rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-poppins-bold text-white">
                  {editMode ? 'Edit Tahun Anggaran' : 'Tambah Tahun Anggaran'}
                </h2>
              </div>
            </div>

            <form onSubmit={handleTahunSubmit} className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-poppins-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Tahun Anggaran
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="text"
                  value={tahunFormData.text}
                  onChange={handleTahunInputChange}
                  required
                  min="2000"
                  max="2100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-third focus:ring-4 focus:ring-hover font-poppins-regular transition-all duration-300 bg-linear-to-br from-white to-gray-50"
                  placeholder="Contoh: 2024"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeTahunModal}
                  className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-poppins-semibold transition-all duration-200 hover:border-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-linear-to-r from-third to-secondary hover:from-secondary hover:to-secondary text-white rounded-xl font-poppins-semibold transition-all duration-200 shadow-lg shadow-hover hover:shadow-xl hover:shadow-third"
                >
                  {editMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-gray-100">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-poppins-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
                  <p className="text-sm font-poppins-regular text-gray-600 leading-relaxed">
                    Apakah Anda yakin ingin menghapus data tahun anggaran ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-poppins-semibold transition-all duration-200 hover:border-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteTahun}
                  className="flex-1 px-5 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-poppins-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}