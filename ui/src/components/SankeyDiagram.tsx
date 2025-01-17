import { useEffect, useRef } from 'react';
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

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ data, doctors }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Process data for Sankey diagram
    const familyMembers = Array.from(new Set(data.map(d => d.familyMember)));
    const doctorIds = Array.from(new Set(data.map(d => d.doctorId)));

    // Create nodes array
    const nodes: SankeyNode[] = [
      ...familyMembers.map(name => ({ name, type: 'family' as const })),
      ...doctorIds.map(id => ({ 
        name: doctors.find(d => d.id === id)?.name || `Dr. ${id}`,
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
      .attr('stroke-width', d => Math.max(1, d.width || 1))
      .attr('opacity', 0.3)
      .on('mouseover', function() {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.3);
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
      .text(d => d.name)
      .attr('font-size', '10px');

  }, [data]);

  return <svg ref={svgRef} />;
}; 