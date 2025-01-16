export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  lastVisited: Date;
}

export interface DoctorVisitStats {
  doctorId: string;
  visitCount: number;
  quarter: string;
  familyMember: string;
}

// Mock data
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    lastVisited: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Dr. John Davis',
    specialty: 'Pediatrics',
    lastVisited: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    specialty: 'Neurology',
    lastVisited: new Date('2024-01-05'),
  },
];

export const mockVisitStats: DoctorVisitStats[] = [
  { doctorId: '1', visitCount: 5, quarter: 'Q1 2024', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, quarter: 'Q2 2024', familyMember: 'Dad' },
  { doctorId: '2', visitCount: 4, quarter: 'Q1 2024', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 6, quarter: 'Q2 2024', familyMember: 'Mom' },
  { doctorId: '3', visitCount: 2, quarter: 'Q1 2024', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, quarter: 'Q2 2024', familyMember: 'Kid' },
]; 