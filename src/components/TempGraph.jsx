function TempGraph({ hourlyData }) {
  if (!hourlyData || hourlyData.length < 3) return null;

  const items = hourlyData.slice(0, 8);
  const temps = items.map((h) => Math.round(h.main.temp));
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const range = maxT - minT || 1;

  const W = 600;
  const H = 140;
  const pad = { top: 32, bottom: 12, left: 25, right: 25 };
  const graphW = W - pad.left - pad.right;
  const graphH = H - pad.top - pad.bottom;

  const points = temps.map((t, i) => ({
    x: pad.left + (i / (temps.length - 1)) * graphW,
    y: pad.top + (1 - (t - minT) / range) * graphH,
    temp: t,
  }));

  // Catmull-Rom → cubic bezier smooth path
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${H} L ${points[0].x},${H} Z`;

  return (
    <div className="temp-graph">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef5350" />
            <stop offset="40%" stopColor="#ffa726" />
            <stop offset="100%" stopColor="#66bb6a" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Filled area under curve */}
        <path d={areaPath} fill="url(#fillGrad)" />

        {/* Gradient line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* First point highlight (current temp) */}
        <circle
          cx={points[0].x}
          cy={points[0].y}
          r="14"
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
        />
        <text
          x={points[0].x}
          y={points[0].y + 4}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {points[0].temp}
        </text>
      </svg>
    </div>
  );
}

export default TempGraph;
