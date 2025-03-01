import { useEffect, useState, useCallback } from 'react';
import { socket } from '../utils/socket';
import { Doctor } from '../types/doctor';
import { DoctorRow } from './DoctorRow';
import { AnimatePresence } from 'framer-motion';

interface DoctorListProps {
  doctors: Doctor[];
  onDelete: (id: string) => void;
}

export const DoctorList: React.FC<DoctorListProps> = ({ doctors, onDelete }) => {
  const [newDoctorIds, setNewDoctorIds] = useState<Set<string>>(new Set());
  const [prevDoctors, setPrevDoctors] = useState<Doctor[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const handleHighlight = (doctorId: string) => {
      setHighlightedId(doctorId);
    };

    const handleUnhighlight = (doctorId: string) => {
      setHighlightedId(null);
    };

    socket.on('doctor:highlight', handleHighlight);
    socket.on('doctor:unhighlight', handleUnhighlight);
    
    return () => { 
      socket.off('doctor:highlight', handleHighlight);
      socket.off('doctor:unhighlight', handleUnhighlight);
    };
  }, []);

  useEffect(() => {
    // Find new doctors by comparing with previous list
    const newIds = doctors
      .filter(doc => !prevDoctors.find(prev => prev.id === doc.id))
      .map(doc => doc.id);

    if (newIds.length > 0) {
      setNewDoctorIds(new Set(newIds));
    }

    setPrevDoctors(doctors);
  }, [doctors]);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Last Visit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {doctors.map((doctor) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                isNew={newDoctorIds.has(doctor.id)}
                isHighlighted={doctor.id === highlightedId}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}; 