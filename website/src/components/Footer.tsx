import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import monev from "/image/logo/logo-sipamas.png";

export default function Footer() {
    return (
        <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center w-45 h-auto bg-white rounded-lg p-4">
                            <img src={monev} className='' alt="" />
                        </div>
                        <p className="font-poppins-regular text-sm leading-relaxed">Platform pengaduan masyarakat yang komprehensif.</p>
                        <div className="flex gap-3 pt-4">
                            <button className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <Facebook size={16} />
                            </button>
                            <button className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <Twitter size={16} />
                            </button>
                            <button className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <Linkedin size={16} />
                            </button>
                            <button className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <Instagram size={16} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-poppins-bold text-white text-lg mb-6">Navigasi</h4>
                        <ul className="space-y-3">
                            <li className="font-poppins-medium text-sm hover:text-primary transition-colors">Beranda</li>
                            <li className="font-poppins-medium text-sm hover:text-primary transition-colors">Realisasi</li>
                            <li className="font-poppins-medium text-sm hover:text-primary transition-colors">Data Paket</li>
                            <li className="font-poppins-medium text-sm hover:text-primary transition-colors">Laporan</li>
                            <li className="font-poppins-medium text-sm hover:text-primary transition-colors">Dokumentasi</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-poppins-bold text-white text-lg mb-6">Hubungi Kami</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-poppins-medium text-sm">Jakarta, Indonesia</p>
                                    <p className="font-poppins-regular text-xs text-gray-400">Jl. Galur No. 123</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <a href="tel:+6221123456" className="font-poppins-medium text-sm hover:text-primary transition-colors">+62 456-1234-5678</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <a href="mailto:info@monevproject.id" className="font-poppins-medium text-sm hover:text-primary transition-colors">info@sipamas.id</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-poppins-bold text-white text-base mb-4">Kebijakan</h4>
                            <div className="flex gap-6">
                                <a href="#" className="font-poppins-medium text-sm hover:text-primary transition-colors">Privasi</a>
                                <a href="#" className="font-poppins-medium text-sm hover:text-primary transition-colors">Syarat & Ketentuan</a>
                                <a href="#" className="font-poppins-medium text-sm hover:text-primary transition-colors">Lisensi</a>
                            </div>
                        </div>
                        <div className="md:text-right">
                            <p className="font-poppins-medium text-sm text-gray-400">&copy; 2026 Sipamas. Semua hak dilindungi.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-950 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="font-poppins-regular text-xs text-gray-500">Dikembangkan oleh <span className="text-primary"></span> Optimus Teknologi Pro</p>
                </div>
            </div>
        </footer>
    );
}