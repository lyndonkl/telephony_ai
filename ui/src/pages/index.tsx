import { useEffect, useState } from 'react';
import { DoctorList } from '../components/DoctorList';
import { VisitGraph } from '../components/VisitGraph';
import { DoctorVisitStats } from '../types/doctor';

export default function Home() {
  const [visitStats, setVisitStats] = useState<DoctorVisitStats[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visits/stats`);
        const data = await response.json();
        setVisitStats(data);
      } catch (error) {
        console.error('Failed to fetch visit stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Doctor Visit Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Doctors List</h2>
            <DoctorList />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Visit Statistics</h2>
            <VisitGraph data={visitStats} />
          </div>
        </div>
      </div>
    </div>
  );
} 