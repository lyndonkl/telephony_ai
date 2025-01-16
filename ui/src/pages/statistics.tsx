import { useEffect, useState } from 'react';
import { VisitGraph } from '../components/VisitGraph';
import { DoctorVisitStats } from '../types/doctor';
import { PageTransition } from '../components/PageTransition';

export default function Statistics() {
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
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Visit Statistics</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <VisitGraph data={visitStats} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 