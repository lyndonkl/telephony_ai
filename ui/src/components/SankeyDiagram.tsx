import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { DoctorVisitStats } from '../types/doctor';
import { Doctor } from '../types/doctor';

interface SankeyDiagramProps {
  data: DoctorVisitStats[];
  doctors: Doctor[];
}

interface SankeyNode {
  name: string;
  type: 'family' | 'doctor';
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface ConnectionDetails {
  doctor: Doctor;
  familyMember: string;
  visits: DoctorVisitStats[];
}

export const SankeyDiagram = forwardRef<{ 
  showConnection: (doctorId: string, familyMember: string) => void;
  closeConnection: () => void;
}, SankeyDiagramProps>(({ data, doctors }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionDetails | null>(null);

  const showConnection = useCallback((doctorId: string, familyMember: string) => {
    console.log('showConnection called with:', { doctorId, familyMember });
    console.log('Available doctors:', doctors);
    const doctor = doctors.find(d => d.id === doctorId);
    console.log('Found doctor:', doctor);
    if (doctor) {
      const visits = data.filter(v => v.familyMember === familyMember && v.doctorId === doctorId);
      console.log('Found visits:', visits);
      setSelectedConnection({ doctor, familyMember, visits });
    }
  }, [data, doctors]);

  const closeConnection = useCallback(() => {
    setSelectedConnection(null);
  }, []);

  useImperativeHandle(ref, () => ({
    showConnection,
    closeConnection
  }), [showConnection]);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Process data for Sankey diagram
    const familyMembers = Array.from(new Set(data.map(d => d.familyMember)));
    const doctorIds = Array.from(new Set(data.map(d => d.doctorId)));

    // Create nodes array
    const nodes: SankeyNode[] = [
      ...familyMembers.map(name => ({ name, type: 'family' as const })),
      ...doctorIds.map(id => ({ 
        name: `${doctors.find(d => d.id === id)?.name}|${id}`,
        type: 'doctor' as const 
      }))
    ];

    // Create links array
    const links: SankeyLink[] = [];
    familyMembers.forEach((family, familyIndex) => {
      doctorIds.forEach((doctor, doctorIndex) => {
        const totalVisits = data
          .filter(d => d.familyMember === family && d.doctorId === doctor)
          .reduce((sum, d) => sum + d.visitCount, 0);
        
        if (totalVisits > 0) {
          links.push({
            source: familyIndex,
            target: familyMembers.length + doctorIndex,
            value: totalVisits
          });
        }
      });
    });

    // Set up dimensions
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Clear previous content
    svg.selectAll('*').remove();

    // Create Sankey generator
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    // Generate layout
    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    });

    // Add links
    svg.append('g')
      .selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .style('cursor', 'pointer')
      .attr('stroke-width', d => Math.max(1, d.width || 1))
      .attr('opacity', 0.3)
      .on('mouseover', function(_, d) {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseout', function(_, d) {
        d3.select(this).attr('opacity', 0.3);
      })
      .on('click', (_, d) => {
        console.log('Link clicked:', d);
        const sourceNode = d.source as unknown as SankeyNode;
        const targetNode = d.target as unknown as SankeyNode;
        console.log('Source:', sourceNode, 'Target:', targetNode);
        const familyMember = sourceNode.type === 'family' ? sourceNode.name : targetNode.name;
        const doctorNode = sourceNode.type === 'doctor' ? sourceNode : targetNode;
        const doctorId = doctorNode.name.split('|')[1];
        console.log('Family Member:', familyMember, 'Doctor ID:', doctorId);
        const doctor = doctors.find(d => d.id === doctorId);
        console.log('Found Doctor:', doctor);
        if (doctor) {
          const visits = data.filter(v => v.familyMember === familyMember && v.doctorId === doctorId);
          console.log('Filtered Visits:', visits);
          setSelectedConnection({ doctor, familyMember, visits });
        }
      });

    // Add nodes
    const nodeElements = svg.append('g')
      .selectAll('rect')
      .data(sankeyNodes)
      .join('rect')
      .attr('x', d => d.x0!)
      .attr('y', d => d.y0!)
      .attr('height', d => d.y1! - d.y0!)
      .attr('width', d => d.x1! - d.x0!)
      .attr('fill', d => d.type === 'family' ? '#4f46e5' : '#10b981');

    // Add labels
    svg.append('g')
      .selectAll('text')
      .data(sankeyNodes)
      .join('text')
      .attr('x', d => d.type === 'family' ? d.x1! + 6 : d.x0! - 6)
      .attr('y', d => (d.y1! + d.y0!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.type === 'family' ? 'start' : 'end')
      .text(d => d.type === 'family' ? d.name : d.name.split('|')[0])
      .attr('font-size', '10px');

  }, [data, doctors]);

  return (
    <>
      <svg ref={svgRef} />
      {selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedConnection.familyMember}'s Visits with {selectedConnection.doctor.name}
              </h2>
              <button 
                className="btn btn-ghost"
                onClick={() => setSelectedConnection(null)}
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-96">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Number of Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedConnection.visits
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((visit, index) => (
                      <tr key={index}>
                        <td>{new Date(visit.date).toLocaleDateString('default', { 
                          year: 'numeric', 
                          month: 'long'
                        })}</td>
                        <td>{visit.visitCount} visits</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}); 