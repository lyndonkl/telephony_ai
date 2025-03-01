import { useEffect, useState, useRef } from 'react';
import { PageTransition } from '../components/PageTransition';
import { SankeyDiagram } from '../components/SankeyDiagram';
import { DoctorVisitStats, Doctor } from '../types/doctor';
import { socket } from '../utils/socket';

export default function Relationships() {
  const [visitStats, setVisitStats] = useState<DoctorVisitStats[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const sankeyRef = useRef<{ 
    showConnection: (doctorId: string, familyMember: string) => void;
    closeConnection: () => void;
  }>(null);

  useEffect(() => {
    const handleViewRelationship = (data: { doctorId: string, familyMember: string }) => {
      console.log('Received relationships:view event:', data);
      sankeyRef.current?.showConnection(data.doctorId, data.familyMember);
    };

    const handleCloseRelationship = () => {
      console.log('Received relationships:close event');
      sankeyRef.current?.closeConnection();
    };

    socket.on('relationships:view', handleViewRelationship);
    socket.on('relationships:close', handleCloseRelationship);

    return () => {
      socket.off('relationships:view', handleViewRelationship);
      socket.off('relationships:close', handleCloseRelationship);
    };
  }, []);

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
            <SankeyDiagram ref={sankeyRef} data={visitStats} doctors={doctors} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 