import { Doctor } from '../types/doctor';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DoctorRowProps {
  doctor: Doctor;
  isNew?: boolean;
  onDelete: (id: string) => void;
}

export const DoctorRow: React.FC<DoctorRowProps> = ({ doctor, isNew = false, onDelete }) => {
  const [highlight, setHighlight] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setHighlight(false), 10000); // Fade out after 10s
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <motion.tr
      initial={{ 
        opacity: 0, 
        backgroundColor: 'transparent',
        height: 0,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        height: 'auto',
        scale: 1,
        backgroundColor: highlight ? 'rgba(147, 197, 253, 0.3)' : 'transparent'
      }}
      exit={{
        opacity: 0,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        height: 0,
        scale: 0.95,
      }}
      transition={{
        opacity: { duration: 2 },
        height: { duration: 1.5, ease: "easeOut" },
        scale: { duration: 1.8, ease: "easeOut" },
        backgroundColor: { duration: 8, ease: 'easeOut' }
      }}
      className="hover:bg-base-200"
    >
      <td>{doctor.name}</td>
      <td>{doctor.specialty}</td>
      <td>{new Date(doctor.lastVisited).toLocaleDateString()}</td>
      <td>
        <button 
          className="btn btn-error btn-sm"
          onClick={() => onDelete(doctor.id)}
        >
          Delete
        </button>
      </td>
    </motion.tr>
  );
}; 