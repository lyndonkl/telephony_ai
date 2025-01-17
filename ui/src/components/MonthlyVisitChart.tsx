import { motion, AnimatePresence } from 'framer-motion';
import { DoctorVisitStats } from '../types/doctor';
import React from 'react';

interface MonthlyVisitChartProps {
  data: DoctorVisitStats[];
}

const VisitBarContainer = React.memo(({ familyMember, children }: { 
  familyMember: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center h-10">
    <div className="w-32">{familyMember}</div>
    <div className="flex-1 h-10 bg-base-200 rounded-lg overflow-hidden">
      {children}
    </div>
  </div>
));

const VisitBar = ({ visitCount, maxVisits }: { visitCount: number; maxVisits: number }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={visitCount}
      className="h-full bg-primary"
      initial={{ width: 0 }}
      animate={{ width: `${(visitCount / maxVisits) * 100}%` }}
      exit={{ width: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="h-full flex items-center px-4 text-white">
        {visitCount} visits
      </div>
    </motion.div>
  </AnimatePresence>
);

export const MonthlyVisitChart: React.FC<MonthlyVisitChartProps> = ({ data }) => {
  const maxVisits = Math.max(...data.map(d => d.visitCount));

  const familyMembers = React.useMemo(() => 
    [...new Set(data.map(d => d.familyMember))],
    []
  );

  return (
    <div className="space-y-4">
      {familyMembers.map((familyMember) => (
        <VisitBarContainer key={familyMember} familyMember={familyMember}>
          <VisitBar 
            visitCount={data.find(d => d.familyMember === familyMember)?.visitCount || 0}
            maxVisits={maxVisits}
          />
        </VisitBarContainer>
      ))}
    </div>
  );
}; 