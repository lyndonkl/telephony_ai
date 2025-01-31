import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeartRateChartProps {
  data: Array<{time: Date, value: number}>;
}

export const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const SECONDS_TO_SHOW = 10; // Show last 10 seconds for detail

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate dynamic y-axis range based on current heart rate
    const currentHeartRate = data[data.length - 1]?.value || 0;
    const minY = Math.max(0, currentHeartRate - 30); // 30 BPM below current
    const maxY = currentHeartRate + 30; // 30 BPM above current

    // Create scales first
    const now = new Date();
    const xScale = d3.scaleTime()
      .domain([new Date(now.getTime() - SECONDS_TO_SHOW * 1000), now])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);

    // Add background grid
    const gridColor = '#e5e7eb';

    // Vertical grid lines (every second)
    const secondsInterval = 1000; // 1 second
    for (let t = now.getTime() - SECONDS_TO_SHOW * 1000; t <= now.getTime(); t += secondsInterval) {
      const x = xScale(new Date(t));
      svg.append('line')
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', height)
        .attr('stroke', gridColor)
        .attr('stroke-width', t % 5000 === 0 ? 0.5 : 0.2); // Darker lines every 5 seconds
    }

    // Horizontal grid lines - adjust to match BPM intervals
    const bpmInterval = 5; // Show grid every 5 BPM
    for (let y = minY; y <= maxY; y += bpmInterval) {
      const yPos = yScale(y);
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', yPos)
        .attr('x2', width)
        .attr('y2', yPos)
        .attr('stroke', gridColor)
        .attr('stroke-width', y % 10 === 0 ? 0.5 : 0.2); // Darker lines every 10 BPM
    }

    // Create line generator with cardinal interpolation for smoother curves
    const line = d3.line<{time: Date, value: number}>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal.tension(0.5));

    // Add axes with custom styling
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => d3.timeFormat('%H:%M:%S')(d as Date));

    const yAxis = d3.axisLeft(yScale)
      .ticks(6)
      .tickFormat(d => `${Math.round(+d)}`);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .style('font-size', '10px');

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .style('font-size', '10px');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('BPM');

    // Create clip path
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    // Create path group with clip path
    const pathGroup = svg.append('g')
      .attr('clip-path', 'url(#clip)');

    // Add glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Add the line path with glow effect
    pathGroup.append('path')
      .attr('class', 'glow')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff4081')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)')
      .attr('d', line);

    // Add current value indicator
    if (data.length > 0) {
      const latest = data[data.length - 1];
      pathGroup.append('circle')
        .attr('cx', xScale(latest.time))
        .attr('cy', yScale(latest.value))
        .attr('r', 4)
        .attr('fill', '#ff4081')
        .attr('filter', 'url(#glow)');
    }

    // Update function
    const update = () => {
      const now = new Date();
      xScale.domain([new Date(now.getTime() - SECONDS_TO_SHOW * 1000), now]);

      // Update y-axis range based on current heart rate
      if (data.length > 0) {
        const currentValue = data[data.length - 1].value;
        const newMinY = Math.max(0, currentValue - 30);
        const newMaxY = currentValue + 30;
        yScale.domain([newMinY, newMaxY]);
        
        svg.select('.y-axis')
          .transition()
          .duration(200)
          .call(yAxis);
      }

      // Update x-axis with smooth transition
      svg.select('.x-axis')
        .transition()
        .duration(200)
        .call(xAxis);

      // Update line with smooth transition
      pathGroup.select('.glow')
        .datum(data)
        .attr('d', line);

      // Update current value indicator
      if (data.length > 0) {
        const latest = data[data.length - 1];
        pathGroup.select('circle')
          .attr('cx', xScale(latest.time))
          .attr('cy', yScale(latest.value));
      }
    };

    // Update every 100ms for smoother animation
    const interval = setInterval(update, 100);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="w-full bg-black/5 rounded-lg p-4">
      <div className="bg-white rounded-lg shadow-inner">
        <svg ref={svgRef} className="w-full h-[200px]" />
        {data.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No heart rate data available. Connect a device to start monitoring.
          </div>
        )}
      </div>
    </div>
  );
}; 