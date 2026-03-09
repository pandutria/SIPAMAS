/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '../components/Navbar';
// import LineChart from '../components/LineChart';
import TopPackage from '../components/TopPackage';
import BottomPackage from '../components/BottomPackage';
// import SearchData from '../components/SearchData';
// import { useState } from 'react';
import Footer from '../components/Footer';
import SplashScreen from './SplashScreen';
import Home from '../components/Home';
import Peta from '../components/Peta';
import Kapabilitas from '../components/Kapabilitas';
import Work from '../components/Work';
import AlurMobile from '../components/AlurMobile';
import AlurWebsite from '../components/AlurWebsite';
import Testimonial from '../components/Testimonial';
import { useAuth } from '../context/AuthContext';
import SearchData from '../components/SearchData';
import { useState } from 'react';
import LineChart from '../components/LineChart';

export default function Dashboard() {
  const [selectedRealization, setSelectedRealization] = useState<any>(null);
  const { user } = useAuth();
  return (
    <div className="bg-white">
      <SplashScreen />
      <Navbar />
      <Home />
      <Peta />
      <Kapabilitas />
      <Work />
      <AlurMobile />
      <AlurWebsite />
      <SearchData
        setSelectedRealization={setSelectedRealization}
        />
      <LineChart
        selectedRealization={selectedRealization}
        />
        {(user?.role == "admin-direksi" || user?.role == "admin-ppk" || user?.role == "super-admin") && (
          <div className="">
            <TopPackage />
            <BottomPackage />
          </div>
        )}
      <Testimonial />
      <Footer />
    </div>
  );
};