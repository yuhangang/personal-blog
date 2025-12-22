export default function LogoWordmark({ className }: { className?: string }) {
  // Grid: 64px height. Letters approx 30-40px wide. Spacing 10px.
  // Y U H A N G A N G
  // Common visual language: Stroke 4, Square Caps.
  
  const h = 48; // Letter height
  const w = 32; // Letter width
  const y = 8;  // Top margin
  
  // Helper to offset letters horizontally
  const spacing = 44; 
  let offset = 0;
  
  // We'll define paths relative to 0,0 and translate them.
  // Letter Y (Logo style)
  // V shape + Stem? Or the Sidebar Y?
  // Let's do standard geometric Y.
  // M 0 0 L 16 24 L 32 0. M 16 24 V 48.
  
  return (
    <svg
      viewBox="0 0 420 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="YUHANGANG"
    >
      <defs>
        <style>
          {`
            .letter {
              stroke: currentColor;
              stroke-width: 3.5; 
              stroke-linecap: square;
              stroke-linejoin: round;
            }
          `}
        </style>
      </defs>

      {/* Y */}
      <g transform={`translate(${offset}, ${y})`}>
        <path d={`M0 0 L${w/2} ${h/2} L${w} 0 M${w/2} ${h/2} V${h}`} className="letter" />
      </g>
      
      {/* U */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M0 0 V${h} H${w} V0`} className="letter" />
      </g>

      {/* H */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M0 0 V${h} M0 ${h/2} H${w} M${w} 0 V${h}`} className="letter" />
      </g>

      {/* A */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M0 ${h} V0 H${w} V${h} M0 ${h/2} H${w}`} className="letter" />
      </g>

      {/* N */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M0 ${h} V0 L${w} ${h} V0`} className="letter" />
      </g>

      {/* G */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M${w} 0 H0 V${h} H${w} V${h/2} H${w/2}`} className="letter" />
      </g>

      {/* A */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M0 ${h} V0 H${w} V${h} M0 ${h/2} H${w}`} className="letter" />
      </g>

      {/* N */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M0 ${h} V0 L${w} ${h} V0`} className="letter" />
      </g>

      {/* G */}
      <g transform={`translate(${offset += spacing}, ${y})`}>
         <path d={`M${w} 0 H0 V${h} H${w} V${h/2} H${w/2}`} className="letter" />
      </g>

    </svg>
  );
}
