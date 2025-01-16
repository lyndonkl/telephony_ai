export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  lastVisited: Date;
}

export interface DoctorVisitStats {
  doctorId: string;
  visitCount: number;
  date: string;
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
  {
    id: '4',
    name: 'Dr. Michael Brown',
    specialty: 'Orthopedics',
    lastVisited: new Date('2024-01-12'),
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    specialty: 'Dermatology',
    lastVisited: new Date('2024-01-08'),
  },
  {
    id: '6',
    name: 'Dr. James Wilson',
    specialty: 'Ophthalmology',
    lastVisited: new Date('2024-01-20'),
  },
  {
    id: '7',
    name: 'Dr. Maria Garcia',
    specialty: 'Endocrinology',
    lastVisited: new Date('2024-01-18'),
  },
  {
    id: '8',
    name: 'Dr. Robert Taylor',
    specialty: 'Psychiatry',
    lastVisited: new Date('2024-01-03'),
  }
];

export const mockVisitStats: DoctorVisitStats[] = [
  // Dad's visits
  { doctorId: '1', visitCount: 2, date: '2023-01', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 1, date: '2023-02', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-03', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 5, date: '2023-04', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, date: '2023-05', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 4, date: '2023-06', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 6, date: '2023-07', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 4, date: '2023-08', familyMember: 'Dad' },
  
  // Mom's visits
  { doctorId: '2', visitCount: 5, date: '2023-01', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, date: '2023-02', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 6, date: '2023-03', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, date: '2023-04', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 6, date: '2023-05', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2023-06', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 5, date: '2023-07', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 7, date: '2023-08', familyMember: 'Mom' },
  
  // Kid's visits
  { doctorId: '3', visitCount: 3, date: '2023-01', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2023-02', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, date: '2023-03', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2023-04', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, date: '2023-05', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 5, date: '2023-06', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 3, date: '2023-07', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, date: '2023-08', familyMember: 'Kid' },
  
  // Grandma's visits
  { doctorId: '4', visitCount: 4, date: '2023-01', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-02', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 7, date: '2023-03', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2023-04', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-05', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 7, date: '2023-06', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2023-07', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2023-08', familyMember: 'Grandma' },
  
  // Grandpa's visits
  { doctorId: '5', visitCount: 5, date: '2023-01', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2023-02', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 4, date: '2023-03', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 3, date: '2023-04', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 4, date: '2023-05', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2023-06', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2023-07', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2023-08', familyMember: 'Grandpa' }
]; 