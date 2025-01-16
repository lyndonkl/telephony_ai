import { useEffect, useRef } from 'react';
import { View, parse, Spec } from 'vega';
import { DoctorVisitStats } from '../types/doctor';

interface VisitGraphProps {
  data: DoctorVisitStats[];
}

export const VisitGraph: React.FC<VisitGraphProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const spec: Spec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 800,
      height: 300,
      padding: 5,
      autosize: 'fit',
      signals: [],
      data: [
        {
          name: 'source',
          values: data,
          transform: [
            {
              type: 'formula',
              expr: "datetime(substring(datum.date, 0, 4), " + 
                    "parseInt(substring(datum.date, 5, 7)) - 1, 1)",
              as: 'quarterDate'
            },
            {
              type: 'aggregate',
              groupby: ['date', 'quarterDate'],
              fields: ['visitCount', 'visitCount'],
              ops: ['mean', 'stdev'],
              as: ['mean_visits', 'stdev_visits']
            }
          ]
        },
        {
          name: 'confidence',
          source: 'source',
          transform: [
            {
              type: 'formula',
              expr: 'datum.mean_visits + (datum.stdev_visits * 1.96)',
              as: 'upper'
            },
            {
              type: 'formula',
              expr: 'datum.mean_visits - (datum.stdev_visits * 1.96)',
              as: 'lower'
            }
          ]
        }
      ],
      scales: [
        {
          name: 'x',
          type: 'band',
          range: 'width',
          domain: {
            data: 'source',
            field: 'date',
            sort: {
              field: 'quarterDate',
              order: 'ascending'
            }
          },
          padding: 0.2
        },
        {
          name: 'y',
          type: 'linear',
          range: 'height',
          nice: true,
          zero: false,
          domain: {
            fields: [
              { data: 'confidence', field: 'lower' },
              { data: 'confidence', field: 'upper' }
            ]
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          scale: 'x',
          title: 'Quarter',
          labelAngle: -45,
          labelAlign: 'right'
        },
        {
          orient: 'left',
          scale: 'y',
          title: 'Visit Count'
        }
      ],
      marks: [
        {
          type: 'area',
          from: { data: 'confidence' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'date' },
              y: { scale: 'y', field: 'lower' },
              y2: { scale: 'y', field: 'upper' },
              fill: { value: '#4299e1' },
              opacity: { value: 0.3 }
            }
          }
        },
        {
          type: 'line',
          from: { data: 'source' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'date' },
              y: { scale: 'y', field: 'mean_visits' },
              stroke: { value: '#2b6cb0' },
              strokeWidth: { value: 3 }
            }
          }
        },
        {
          type: 'symbol',
          from: { data: 'source' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'date' },
              y: { scale: 'y', field: 'mean_visits' },
              size: { value: 100 },
              fill: { value: '#2b6cb0' }
            }
          }
        }
      ],
      title: {
        text: 'Average Doctor Visits per Quarter',
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

  return <div ref={containerRef} className="w-full h-[400px] overflow-hidden" />;
}; 