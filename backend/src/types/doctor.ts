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
  // Dad's visits (moderate frequency, seasonal variation)
  // 2022
  { doctorId: '1', visitCount: 3, date: '2022-01', familyMember: 'Dad' }, // Winter
  { doctorId: '1', visitCount: 3, date: '2022-02', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2022-03', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2022-04', familyMember: 'Dad' }, // Spring
  { doctorId: '1', visitCount: 2, date: '2022-05', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 1, date: '2022-06', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 1, date: '2022-07', familyMember: 'Dad' }, // Summer
  { doctorId: '1', visitCount: 2, date: '2022-08', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2022-09', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2022-10', familyMember: 'Dad' }, // Fall
  { doctorId: '1', visitCount: 3, date: '2022-11', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, date: '2022-12', familyMember: 'Dad' },
  // 2023
  { doctorId: '1', visitCount: 3, date: '2023-01', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, date: '2023-02', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-03', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-04', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-05', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 1, date: '2023-06', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 1, date: '2023-07', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-08', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-09', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 2, date: '2023-10', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, date: '2023-11', familyMember: 'Dad' },
  { doctorId: '1', visitCount: 3, date: '2023-12', familyMember: 'Dad' },

  // Mom's visits (slightly more frequent than Dad)
  // 2022
  { doctorId: '2', visitCount: 4, date: '2022-01', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2022-02', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2022-03', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2022-04', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2022-05', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2022-06', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2022-07', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2022-08', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2022-09', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2022-10', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, date: '2022-11', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, date: '2022-12', familyMember: 'Mom' },
  // 2023
  { doctorId: '2', visitCount: 4, date: '2023-01', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2023-02', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2023-03', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2023-04', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2023-05', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2023-06', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2023-07', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 2, date: '2023-08', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2023-09', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 3, date: '2023-10', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, date: '2023-11', familyMember: 'Mom' },
  { doctorId: '2', visitCount: 4, date: '2023-12', familyMember: 'Mom' },

  // Kid's visits (fewer, with seasonal spikes during flu season)
  // 2022
  { doctorId: '3', visitCount: 2, date: '2022-01', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2022-02', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-03', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-04', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-05', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-06', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-07', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-08', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2022-09', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2022-10', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2022-11', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2022-12', familyMember: 'Kid' },
  // 2023
  { doctorId: '3', visitCount: 2, date: '2023-01', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2023-02', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-03', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-04', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-05', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-06', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-07', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-08', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 1, date: '2023-09', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2023-10', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2023-11', familyMember: 'Kid' },
  { doctorId: '3', visitCount: 2, date: '2023-12', familyMember: 'Kid' },

  // Grandma's visits (frequent due to chronic conditions)
  // 2022
  { doctorId: '4', visitCount: 6, date: '2022-01', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2022-02', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2022-03', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2022-04', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2022-05', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2022-06', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2022-07', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2022-08', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2022-09', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2022-10', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2022-11', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2022-12', familyMember: 'Grandma' },
  // 2023
  { doctorId: '4', visitCount: 6, date: '2023-01', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2023-02', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-03', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-04', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-05', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2023-06', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2023-07', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 4, date: '2023-08', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-09', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 5, date: '2023-10', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2023-11', familyMember: 'Grandma' },
  { doctorId: '4', visitCount: 6, date: '2023-12', familyMember: 'Grandma' },

  // Grandpa's visits (most frequent due to multiple conditions)
  // 2022
  { doctorId: '5', visitCount: 7, date: '2022-01', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 7, date: '2022-02', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2022-03', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2022-04', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2022-05', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2022-06', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2022-07', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2022-08', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2022-09', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2022-10', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 7, date: '2022-11', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 7, date: '2022-12', familyMember: 'Grandpa' },
  // 2023
  { doctorId: '5', visitCount: 7, date: '2023-01', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 7, date: '2023-02', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2023-03', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2023-04', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2023-05', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2023-06', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2023-07', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 5, date: '2023-08', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2023-09', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 6, date: '2023-10', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 7, date: '2023-11', familyMember: 'Grandpa' },
  { doctorId: '5', visitCount: 7, date: '2023-12', familyMember: 'Grandpa' }
]; 