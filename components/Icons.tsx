import React from 'react';

const iconPaths: Record<string, React.ReactNode> = {
    flask: (
        <>
            <path d="M9 2v10.3A5.002 5.002 0 0 0 12 22a5 5 0 0 0 3-12.3V2" />
            <path d="M6 2h12" />
        </>
    ),
    brainCircuit: (
        <>
            <path d="M12 5a3 3 0 1 0-5.99 1H6" />
            <path d="M12 5a3 3 0 1 1 5.99 1H18" />
            <path d="M6 12a3 3 0 1 0-5.99-1H0" />
            <path d="M18 12a3 3 0 1 1 5.99-1H24" />
            <path d="M12 19a3 3 0 1 0-5.99-1H6" />
            <path d="M12 19a3 3 0 1 1 5.99-1H18" />
            <path d="M6 12h12" />
            <path d="M6 6h.01" />
            <path d="M18 6h.01" />
            <path d="M6 18h.01" />
            <path d="M18 18h.01" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </>
    ),
    trendingUp: (
        <>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </>
    ),
    trendingDown: (
        <>
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
        </>
    ),
    barChart: (
        <>
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
        </>
    ),
    scale: (
        <>
            <path d="m16 16 3-8 3 8c-2 1-4 1-6 0Z" />
            <path d="m2 16 3-8 3 8c-2 1-4 1-6 0Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </>
    ),
    lightbulb: (
        <>
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
        </>
    ),
    alertTriangle: (
        <>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </>
    ),
    activity: (
        <>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </>
    ),
    users: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
    ),
    cube: (
        <>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </>
    ),
    beaker: (
        <>
            <path d="M4.5 3h15" />
            <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-16V3" />
            <path d="M6 14h12" />
        </>
    ),
    filter: (
        <>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </>
    ),
    checkCircle: (
        <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </>
    ),
    molecule: (
        <>
            <path d="M17.8 8.2a2.4 2.4 0 1 0-3.6 3.6" />
            <path d="M12 12a2.4 2.4 0 1 0-3.6 3.6" />
            <path d="M14.2 14.2 6.2 6.2" />
            <path d="m12 18 2.2-2.2" />
            <path d="m6 12-2.2 2.2" />
            <path d="m18 6-2.2-2.2" />
            <path d="M6.2 17.8a2.4 2.4 0 1 0-3.6-3.6" />
        </>
    ),
    dna: (
        <>
            <path d="M4.63 19.37c-1.2-1.2-1.2-3.14 0-4.24l8.49-8.49c1.2-1.2 3.14-1.2 4.24 0l.71.71c1.2 1.2 1.2 3.14 0 4.24l-8.49 8.49c-1.2 1.2-3.14 1.2-4.24 0l-.71-.71Z" />
            <path d="m14.12 9.88 5.66 5.66" />
            <path d="m4.22 10.34 3.54-3.54" />
            <path d="m10.34 4.22 3.54 3.54" />
            <path d="m19.78 14.12-5.66-5.66" />
        </>
    ),
    clipboardList: (
        <>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <path d="M12 11h4"></path>
            <path d="M12 16h4"></path>
            <path d="M8 11h.01"></path>
            <path d="M8 16h.01"></path>
        </>
    ),
    gitBranch: (
        <>
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
        </>
    ),
    testTube: (
        <>
            <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
            <path d="M8.5 2h7" />
            <path d="M14.5 16h-5" />
        </>
    ),
    sparkles: (
        <>
            <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9L12 3z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </>
    ),
    codeBrackets: (
        <>
            <path d="m10 10-4 4 4 4" />
            <path d="m14 14 4-4-4-4" />
        </>
    ),
    fileCode: (
        <>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="m10 13-2 2 2 2" />
            <path d="m14 17 2-2-2-2" />
        </>
    ),
    smartphone: (
        <>
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <path d="M12 18h.01"></path>
        </>
    ),
    server: (
        <>
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </>
    ),
    database: (
        <>
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </>
    ),
    share2: (
        <>
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </>
    ),
    dollarSign: (
        <>
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </>
    ),
};

export type IconName = keyof typeof iconPaths;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
};