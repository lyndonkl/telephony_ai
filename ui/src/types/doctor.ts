export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  lastVisited: Date;
}

export interface DoctorVisitStats {
  doctorId: string;
  visitCount: number;
  quarter?: string;
  date: string;
  familyMember: string;
} 