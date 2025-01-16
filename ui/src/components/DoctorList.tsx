import { useEffect, useState, useCallback } from 'react';
import { socket } from '../utils/socket';
import { Doctor } from '../types/doctor';

export const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial doctors list
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();

    // Listen for doctors list updates
    const handleDoctorsList = (updatedDoctors: Doctor[]) => {
      setDoctors(updatedDoctors);
    };

    // Listen for highlight events
    const handleHighlight = (doctorId: string) => {
      setHighlightedId(doctorId);
      // Reset highlight after 2 seconds
      setTimeout(() => setHighlightedId(null), 2000);
    };

    socket.on('doctors:list', handleDoctorsList);
    socket.on('doctor:highlight', handleHighlight);

    return () => {
      socket.off('doctors:list', handleDoctorsList);
      socket.off('doctor:highlight', handleHighlight);
    };
  }, []);

  const handleDelete = useCallback(async (doctorId: string) => {
    console.log('Attempting to delete doctor:', doctorId);
    try {
      // Add fallback URL if environment variable is not set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const url = `${apiUrl}/api/doctors/${doctorId}`;
      console.log('Delete request URL:', url);
      
      await fetch(url, {
        method: 'DELETE',
      });
      console.log('Delete request successful');
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Last Visited</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr 
              key={doctor.id}
              className={`hover ${highlightedId === doctor.id ? 'bg-primary bg-opacity-20' : ''}`}
            >
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>{new Date(doctor.lastVisited).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(doctor.id)}
                  aria-label={`Delete ${doctor.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 