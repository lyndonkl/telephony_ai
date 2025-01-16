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
  { doctorId: '1', visitCount: 3, quarter: 'Q2 2022', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 4, quarter: 'Q3 2022', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, quarter: 'Q4 2022', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 5, quarter: 'Q1 2023', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, quarter: 'Q2 2023', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 4, quarter: 'Q3 2023', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 6, quarter: 'Q4 2023', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 4, quarter: 'Q1 2024', familyMember: 'Dad' },
  
  // Mom's visits
  { doctorId: '2', visitCount: 5, quarter: 'Q2 2022', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, quarter: 'Q3 2022', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 6, quarter: 'Q4 2022', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, quarter: 'Q1 2023', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 6, quarter: 'Q2 2023', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, quarter: 'Q3 2023', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 5, quarter: 'Q4 2023', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 7, quarter: 'Q1 2024', familyMember: 'Mom' },
  
  // Kid's visits
  { doctorId: '3', visitCount: 3, quarter: 'Q2 2022', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, quarter: 'Q3 2022', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, quarter: 'Q4 2022', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, quarter: 'Q1 2023', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, quarter: 'Q2 2023', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 5, quarter: 'Q3 2023', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 3, quarter: 'Q4 2023', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 4, quarter: 'Q1 2024', familyMember: 'Kid' },
  
  // Grandma's visits
  { doctorId: '4', visitCount: 4, quarter: 'Q2 2022', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, quarter: 'Q3 2022', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 7, quarter: 'Q4 2022', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, quarter: 'Q1 2023', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, quarter: 'Q2 2023', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 7, quarter: 'Q3 2023', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, quarter: 'Q4 2023', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, quarter: 'Q1 2024', familyMember: 'Grandma' },
  
  // Grandpa's visits
  { doctorId: '5', visitCount: 5, quarter: 'Q2 2022', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, quarter: 'Q3 2022', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 4, quarter: 'Q4 2022', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 3, quarter: 'Q1 2023', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 4, quarter: 'Q2 2023', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, quarter: 'Q3 2023', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, quarter: 'Q4 2023', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, quarter: 'Q1 2024', familyMember: 'Grandpa' }
]; 