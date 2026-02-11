/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '../components/Navbar';
import LineChart from '../components/LineChart';
import TopPackage from '../components/TopPackage';
import BottomPackage from '../components/BottomPackage';
import SearchData from '../components/SearchData';
import { useState } from 'react';
import Footer from '../components/Footer';
import SplashScreen from './SplashScreen';

export default function Dashboard() {
  const [selectedRealization, setSelectedRealization] = useState<any>(null);
  return (
    <div className="bg-white">
      <SplashScreen/>
      <Navbar/>
      <SearchData
        setSelectedRealization={setSelectedRealization}
      />
      <LineChart
        selectedRealization={selectedRealization}
      />
      <TopPackage/>
      <BottomPackage/>
      <Footer/>
    </div>
  );
};