/** The interlocking NG mark with its blue and cyan glow. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-40 -72 554 554"
      fill="none"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="ng-top" x1="140" y1="112" x2="443" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3344f2" />
          <stop offset="0.45" stopColor="#4aa8f8" />
          <stop offset="1" stopColor="#5fd2fb" />
        </linearGradient>
        <linearGradient id="ng-g" x1="443" y1="190" x2="150" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#eef4ff" />
          <stop offset="0.62" stopColor="#7fdcff" />
          <stop offset="1" stopColor="#2447f5" />
        </linearGradient>
        <linearGradient id="ng-base" x1="31" y1="290" x2="250" y2="395" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6c88fa" />
          <stop offset="1" stopColor="#1a2bb8" />
        </linearGradient>
        <linearGradient id="ng-n" x1="31" y1="96" x2="31" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f1f4ff" />
          <stop offset="1" stopColor="#7d96fb" />
        </linearGradient>
        <filter id="ng-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>

      {/* Glow */}
      <g filter="url(#ng-glow)" opacity="0.55">
        <path d="M140 112 297 34 443 118V166" stroke="#3b82f6" strokeWidth="62" strokeLinejoin="round" />
        <path d="M31 286 262 396" stroke="#2447f5" strokeWidth="62" />
        <path d="M443 204V282L285 368" stroke="#38bdf8" strokeWidth="56" strokeLinejoin="round" />
      </g>

      {/* Upper band of the hexagon */}
      <path d="M140 112 297 34 443 118V166" stroke="url(#ng-top)" strokeWidth="62" strokeLinejoin="round" />
      {/* Lower-left band */}
      <path d="M31 240V286L262 396" stroke="url(#ng-base)" strokeWidth="62" strokeLinejoin="round" />
      {/* G: crossbar, right side, and the lower sweep that tucks under the N */}
      <path d="M336 204H443V282L285 368 150 268" stroke="#09090b" strokeWidth="76" strokeLinejoin="round" />
      <path d="M336 204H443V282L285 368 150 268" stroke="url(#ng-g)" strokeWidth="56" strokeLinejoin="round" />
      {/* N */}
      <path d="M31 300V96L262 268V100" stroke="#09090b" strokeWidth="82" strokeLinejoin="round" />
      <path d="M31 300V96L262 268V100" stroke="url(#ng-n)" strokeWidth="62" strokeLinejoin="round" />
    </svg>
  );
}
