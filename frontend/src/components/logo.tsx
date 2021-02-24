import React, { ReactElement } from "react";

interface LogoProps {
  width?: number,
  height?: number,
}

export default function Logo({ width, height }: LogoProps): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width ? width : undefined}
      height={height ? height : undefined}
      viewBox="0 0 300 90"
    >
      <defs>
        <linearGradient id="prefix__c">
          <stop offset="0" stopColor="#9bdfd0" />
          <stop offset="1" stopColor="#60cdb7" />
        </linearGradient>
        <linearGradient id="prefix__b">
          <stop offset="0" stopColor="#60cdb7" />
          <stop offset="1" stopColor="#4bab98" />
        </linearGradient>
        <linearGradient id="prefix__a">
          <stop offset="0" stopColor="#74d3c0" />
          <stop offset="1" stopColor="#3a9885" />
        </linearGradient>
        <linearGradient xlinkHref="#prefix__a" id="prefix__d" x1="70.364" y1="121.773" x2="126.366" y2="178.663" gradientUnits="userSpaceOnUse"/>
        <linearGradient xlinkHref="#prefix__b" id="prefix__e" gradientUnits="userSpaceOnUse" x1="176.84" y1="145.397" x2="209.342" y2="163.161"/>
        <linearGradient xlinkHref="#prefix__c" id="prefix__f" x1="178.458" y1="127.222" x2="222.836" y2="150.742" gradientUnits="userSpaceOnUse"/>
        <linearGradient xlinkHref="#prefix__c" id="prefix__g" gradientUnits="userSpaceOnUse" x1="178.458" y1="127.222" x2="222.836" y2="150.742"/>
        <linearGradient xlinkHref="#prefix__c" id="prefix__h" gradientUnits="userSpaceOnUse" x1="178.458" y1="127.222" x2="222.836" y2="150.742"/>
      </defs>
      <g>
        <path d="M126.578 113.22H22.255v17.358h23.478L16.76 180.78h25.475l19.107-33.218 6.992-15.11 5.87 12.488 13.901 27.514 11.964-18.42-12.254-23.456h21.758v8.823z" fill="url(#prefix__d)" transform="translate(0 -102)" />
        <path d="M216.992 113.22h-90.414l-17.004 26.18v32.829l-9.504-18.194-11.964 18.42 4.207 8.325h80.8l11.443-17.62h-54.448v-32.448h75.523z" fill="url(#prefix__e)" transform="translate(0 -102)" />
        <g fill="url(#prefix__f)" transform="translate(0 -102)">
          <path d="M184.556 163.16l-11.443 17.62h110.126v-17.62h-13.435l2.281-26.49h-19.9l-2.282 26.49h-20.66l2.281-26.49h-19.9l-2.282 26.49h-12.055z" fill="url(#prefix__g)" />
          <path d="M216.992 113.22l-11.36 17.492h77.607V113.22z" fill="url(#prefix__h)" />
        </g>
      </g>
    </svg>
  );
}