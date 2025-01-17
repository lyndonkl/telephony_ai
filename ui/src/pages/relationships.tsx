import { useEffect, useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { SankeyDiagram } from '../components/SankeyDiagram';
import { DoctorVisitStats, Doctor } from '../types/doctor';

export default function Relationships() {
  const [visitStats, setVisitStats] = useState<DoctorVisitStats[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

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

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchStats();
    fetchDoctors();
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Family-Doctor Relationships</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <SankeyDiagram data={visitStats} doctors={doctors} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 