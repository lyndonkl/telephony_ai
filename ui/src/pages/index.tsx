import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DoctorList } from '../components/DoctorList';
import { PageTransition } from '../components/PageTransition';
import { socket } from '../utils/socket';
import { Doctor } from '../types/doctor';

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
      const data = await response.json();
      setDoctors(data);
    };

    fetchDoctors();
    socket.on('doctors:list', setDoctors);
    return () => { socket.off('doctors:list', setDoctors); };
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Doctor Visit Dashboard</h1>
        <div className="flex justify-end mb-4">
          <Link 
            href="/visit-trends" 
            className="btn btn-primary"
          >
            View Visit Trends
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Doctors List</h2>
              <DoctorList doctors={doctors} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 