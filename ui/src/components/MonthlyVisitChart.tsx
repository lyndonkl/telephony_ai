import { useEffect, useRef } from 'react';
import { View, parse, Spec } from 'vega';
import { DoctorVisitStats } from '../types/doctor';

interface MonthlyVisitChartProps {
  data: DoctorVisitStats[];
}

export const MonthlyVisitChart: React.FC<MonthlyVisitChartProps> = ({ data }) => {
  console.log('MonthlyVisitChart data:', data);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log('No data available for chart');
      return;
    }
    if (!containerRef.current) return;

    const spec: Spec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 800,
      height: 500,
      padding: { top: 20, right: 30, bottom: 60, left: 50 },
      autosize: 'fit',
      signals: [
        { 
          name: "heightScale",
          value: 0,
          on: [{ events: "timer", update: "1" }]
        }
      ],
      data: [
        {
          name: 'visits',
          values: data
        }
      ],
      scales: [
        {
          name: 'x',
          type: 'band',
          range: 'width',
          domain: { data: 'visits', field: 'familyMember' },
          padding: 0.2
        },
        {
          name: 'y',
          type: 'linear',
          range: 'height',
          nice: true,
          zero: true,
          domain: { data: 'visits', field: 'visitCount' }
        },
        {
          name: 'color',
          type: 'ordinal',
          range: {
            scheme: 'category10'
          },
          domain: { data: 'visits', field: 'familyMember' }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          scale: 'x',
          title: 'Family Member'
        },
        {
          orient: 'left',
          scale: 'y',
          title: 'Number of Visits'
        }
      ],
      marks: [
        {
          type: 'rect',
          from: { data: 'visits' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'familyMember' },
              width: { scale: 'x', band: 0.8 },
              y: { scale: 'y', field: 'visitCount' },
              y2: { scale: 'y', value: 0 },
              fill: { scale: 'color', field: 'familyMember' },
              tooltip: {
                signal: "{" +
                  "'Family Member': datum.familyMember, " +
                  "'Visits': datum.visitCount" +
                "}"
              }
            },
            update: {
              fillOpacity: { value: 1 }
            },
            hover: {
              fillOpacity: { value: 0.8 }
            }
          }
        }
      ],
      title: {
        text: 'Monthly Visits by Family Member',
        fontSize: 16
      }
    };

    const runtime = parse(spec);
    const view = new View(runtime)
      .initialize(containerRef.current)
      .width(containerRef.current.clientWidth)
      .hover()
      .run();

    viewRef.current = view;

    const handleResize = () => {
      if (containerRef.current && viewRef.current) {
        viewRef.current
          .width(containerRef.current.clientWidth)
          .run();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (viewRef.current) {
        viewRef.current.finalize();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[500px] overflow-hidden" />;
}; 