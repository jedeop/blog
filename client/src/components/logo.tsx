import React from 'react'

interface LogoProps {
  width?: number,
  height?: number,
  color?: string,
}

export default function Logo({ width, height, color = "#FFFFFF" }: LogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      width={width ? width : "auto"}
      height={height ? height : "auto"}
      fill={color}
      viewBox="0 0 300 90"
    >
      <g>
        <path d="M12.205 8.563v18.724H37.53L6.278 81.437h27.48l20.61-35.83 7.543-16.3 6.33 13.47 19.533 38.66h205.948V62.432h-14.493l2.461-28.575h-21.466l-2.46 28.575h-22.287l2.461-28.575h-21.466l-2.461 28.575h-85.468V27.431H293.722V8.563H106.394zm70.72 18.724h23.469v44.927z" strokeWidth=".265" />
      </g>
    </svg>
  )
}