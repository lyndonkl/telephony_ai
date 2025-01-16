import { useEffect, useState } from 'react';
import { VisitGraph } from '../components/VisitGraph';
import { DoctorVisitStats } from '../types/doctor';
import { PageTransition } from '../components/PageTransition';

// Helper function to convert YYYY-MM to quarter
const getQuarter = (date: string) => {
  const month = parseInt(date.split('-')[1]);
  const year = date.split('-')[0];
  const quarter = Math.ceil(month / 3);
  return `Q${quarter} ${year}`;
};

// Helper function to aggregate monthly data into quarters
const aggregateToQuarters = (data: DoctorVisitStats[]): DoctorVisitStats[] => {
  const quarterMap = new Map<string, Map<string, number>>();

  // Group by quarter and family member
  data.forEach(visit => {
    const quarter = getQuarter(visit.date);
    if (!quarterMap.has(quarter)) {
      quarterMap.set(quarter, new Map());
    }
    const familyMap = quarterMap.get(quarter)!;
    const currentCount = familyMap.get(visit.familyMember) || 0;
    familyMap.set(visit.familyMember, currentCount + visit.visitCount);
  });

  // Convert to array format
  const result: DoctorVisitStats[] = [];
  quarterMap.forEach((familyMap, quarter) => {
    familyMap.forEach((visitCount, familyMember) => {
      result.push({
        doctorId: '0', // Not relevant for aggregated data
        visitCount,
        date: quarter,
        familyMember
      });
    });
  });

  return result;
};

export default function VisitTrends() {
  const [visitStats, setVisitStats] = useState<DoctorVisitStats[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visits/stats`);
        const data = await response.json();
        console.log('Raw visit stats:', data);
        const quarterlyData = aggregateToQuarters(data);
        console.log('Aggregated quarterly data:', quarterlyData);
        setVisitStats(quarterlyData);
      } catch (error) {
        console.error('Failed to fetch visit stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Visit Trends</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <VisitGraph data={visitStats} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 