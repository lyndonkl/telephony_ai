import { useEffect, useState } from 'react';
import { MonthlyVisitChart } from '../components/MonthlyVisitChart';
import { DoctorVisitStats } from '../types/doctor';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function MonthlyVisits() {
  const [visitStats, setVisitStats] = useState<DoctorVisitStats[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visits/stats`);
        const data = await response.json();
        console.log('Monthly visit stats:', data);
        setVisitStats(data);
        const months = Array.from(new Set(data.map((visit: DoctorVisitStats) => visit.date))) as string[];
        console.log('Available months:', months);
        setCurrentMonth(months[months.length - 1] || '');
      } catch (error) {
        console.error('Failed to fetch visit stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handlePrevMonth = () => {
    const months = Array.from(new Set(visitStats.map(visit => visit.date))).sort();
    const currentIndex = months.indexOf(currentMonth);
    if (currentIndex > 0) {
      setCurrentMonth(months[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const months = Array.from(new Set(visitStats.map(visit => visit.date))).sort();
    const currentIndex = months.indexOf(currentMonth);
    if (currentIndex < months.length - 1) {
      setCurrentMonth(months[currentIndex + 1]);
    }
  };

  const isFirstMonth = () => {
    const months = Array.from(new Set(visitStats.map(visit => visit.date))).sort();
    return months.indexOf(currentMonth) === 0;
  };

  const isLastMonth = () => {
    const months = Array.from(new Set(visitStats.map(visit => visit.date))).sort();
    return months.indexOf(currentMonth) === months.length - 1;
  };

  return (
    <PageTransition>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Monthly Visit Breakdown</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <button 
                className="btn btn-primary" 
                onClick={handlePrevMonth}
                disabled={isFirstMonth()}
              >
                Previous Month
              </button>
              <h2 className="text-xl font-bold">
                {new Date(currentMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button 
                className="btn btn-primary" 
                onClick={handleNextMonth}
                disabled={isLastMonth()}
              >
                Next Month
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentMonth && (
                  <>
                    {/* Debug output */}
                    {console.log('Current Month:', currentMonth)}
                    {console.log('Filtered Data:', visitStats.filter(visit => visit.date === currentMonth))}
                    <MonthlyVisitChart 
                      data={visitStats.filter(visit => visit.date === currentMonth)} 
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 