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
      width: 500,
      height: 300,
      padding: 5,
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
          domain: { data: 'visits', field: 'quarter' },
          range: 'width',
          padding: 0.1
        },
        {
          name: 'yscale',
          domain: { data: 'visits', field: 'visitCount' },
          nice: true,
          range: 'height'
        },
        {
          name: 'color',
          type: 'ordinal',
          domain: { data: 'visits', field: 'familyMember' },
          range: { scheme: 'category10' }
        }
      ],
      axes: [
        { orient: 'bottom', scale: 'xscale', title: 'Quarter' },
        { orient: 'left', scale: 'yscale', title: 'Visit Count' }
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
            }
          ]
        }
      ]
    };

    const runtime = parse(spec);
    const view = new View(runtime)
      .initialize(containerRef.current)
      .hover()
      .run();

    viewRef.current = view;

    return () => {
      if (viewRef.current) {
        viewRef.current.finalize();
      }
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[400px]" />;
}; 