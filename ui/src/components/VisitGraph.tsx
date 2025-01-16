import { useEffect, useRef } from 'react';
import { View, parse, Spec } from 'vega';

interface VisitGraphProps {
  data: Array<{
    quarter: string;
    familyMember: string;
    visitCount: number;
  }>;
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
      data: [
        {
          name: 'visits',
          values: data
        }
      ],
      scales: [
        {
          name: 'xscale',
          type: 'band',
          domain: { 
            data: 'visits', 
            field: 'quarter',
            sort: true
          },
          range: 'width',
          padding: 0.2
        },
        {
          name: 'yscale',
          type: 'linear',
          domain: { data: 'visits', field: 'visitCount' },
          nice: true,
          range: 'height'
        },
        {
          name: 'color',
          type: 'ordinal',
          domain: { data: 'visits', field: 'familyMember' },
          range: { scheme: 'category20' }
        }
      ],
      axes: [
        { 
          orient: 'bottom', 
          scale: 'xscale', 
          title: 'Quarter',
          labelAngle: -45,
          labelAlign: 'right'
        },
        { 
          orient: 'left', 
          scale: 'yscale', 
          title: 'Visit Count',
          grid: true
        }
      ],
      marks: [
        {
          type: 'group',
          from: {
            facet: {
              name: 'series',
              data: 'visits',
              groupby: 'familyMember'
            }
          },
          marks: [
            {
              type: 'line',
              from: { data: 'series' },
              encode: {
                enter: {
                  x: { scale: 'xscale', field: 'quarter' },
                  y: { scale: 'yscale', field: 'visitCount' },
                  stroke: { scale: 'color', field: 'familyMember' },
                  strokeWidth: { value: 2 }
                }
              }
            },
            {
              type: 'symbol',
              from: { data: 'series' },
              encode: {
                enter: {
                  x: { scale: 'xscale', field: 'quarter' },
                  y: { scale: 'yscale', field: 'visitCount' },
                  fill: { scale: 'color', field: 'familyMember' },
                  size: { value: 100 }
                }
              }
            }
          ]
        }
      ],
      legends: [
        {
          fill: 'color',
          title: 'Family Member',
          orient: 'right',
          offset: 10,
          padding: 10
        }
      ]
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