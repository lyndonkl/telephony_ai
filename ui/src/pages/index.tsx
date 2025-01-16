import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DoctorList } from '../components/DoctorList';
import { PageTransition } from '../components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Doctor Visit Dashboard</h1>
        <div className="flex justify-end mb-4">
          <Link 
            href="/statistics" 
            className="btn btn-primary"
          >
            View Statistics
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Doctors List</h2>
              <DoctorList />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 