"use client";

import { useEffect, useRef } from "react";

const NODES = [
  { id: "web", label: "Web", x: 80, y: 60 },
  { id: "apps", label: "Apps", x: 220, y: 40 },
  { id: "ai", label: "AI", x: 360, y: 70 },
  { id: "social", label: "Social", x: 120, y: 160 },
  { id: "ads", label: "Ads", x: 280, y: 150 },
  { id: "seo", label: "SEO", x: 400, y: 170 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [2, 4],
  [1, 4],
];

interface RedlineNetworkProps {
  className?: string;
}

export function RedlineNetwork({ className }: RedlineNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let frame = 0;
    let raf = 0;
    const onMove = (event: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const py = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      svg.style.transform = `translate(${px}px, ${py}px)`;
    };

    const animate = () => {
      frame += 0.015;
      const paths = svg.querySelectorAll<SVGPathElement>(".network-path");
      paths.forEach((path, index) => {
        path.style.strokeDashoffset = String(100 - ((frame * 40 + index * 15) % 100));
      });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 480 220"
      className={className}
      role="img"
      aria-label="Connected growth system diagram showing Web, Apps, AI, Social, Ads, and SEO"
    >
      <defs>
        <linearGradient id="redlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8D0715" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#F21D2F" />
          <stop offset="100%" stopColor="#FF3347" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {EDGES.map(([a, b], index) => {
        const n1 = NODES[a];
        const n2 = NODES[b];
        return (
          <path
            key={index}
            className="network-path"
            d={`M ${n1.x} ${n1.y} L ${n2.x} ${n2.y}`}
            fill="none"
            stroke="url(#redlineGrad)"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        );
      })}

      {NODES.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="10" fill="#050505" stroke="#F21D2F" strokeWidth="2" />
          <text
            x={node.x}
            y={node.y + 28}
            textAnchor="middle"
            fill="#F7F4EF"
            fontSize="11"
            fontFamily="var(--font-space-grotesk), sans-serif"
            fontWeight="600"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
