import Image from 'next/image';

interface RobotXIconProps {
  size?: number;
  className?: string;
  darkBg?: boolean;
}

export function RobotXIcon({ size = 24, className = '', darkBg = false }: RobotXIconProps) {
  return (
    <Image
      src="/assets/images/logo.png"
      alt="RobotX"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', ...(darkBg ? { mixBlendMode: 'screen' } : {}) }}
    />
  );
}

export function MetaMaskIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 318.6 318.6" className={className}>
      <polygon fill="#E2761B" points="274.1,35.5 174.6,109.4 193,65.8"/>
      <polygon fill="#E4761B" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
      <polygon fill="#E4761B" points="238.3,206.8 211.8,247.4 268.5,263.1 284.8,207.7"/>
      <polygon fill="#E4761B" points="33.9,207.7 50.1,263.1 106.8,247.4 80.3,206.8"/>
      <polygon fill="#F6851B" points="106.8,247.4 140.6,230.9 111.4,208.1"/>
      <polygon fill="#F6851B" points="177.9,230.9 211.8,247.4 207.1,208.1"/>
      <polygon fill="#C0AD9E" points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.1,253 138.3,262.3 106.8,247.4 117.8,256.4 140.1,271.9 178.4,271.9 200.8,256.4 211.8,247.4"/>
      <polygon fill="#161616" points="177.9,230.9 173.4,227.6 145.1,227.6 140.6,230.9 138.1,253 140.4,250.8 178.1,250.8 180.6,253"/>
      <polygon fill="#F6851B" points="267.2,153.5 214.9,138.2 230.8,162.1 207.1,208.1 238.3,207.7 284.8,207.7"/>
      <polygon fill="#F6851B" points="103.6,138.2 51.3,153.5 33.9,207.7 80.3,207.7 111.4,208.1 87.8,162.1"/>
      <polygon fill="#F6851B" points="174.6,164.6 177.9,106.9 193.1,65.8 125.6,65.8 140.6,106.9 143.8,164.6 145,182.5 145.1,227.6 173.4,227.6 173.6,182.5"/>
    </svg>
  );
}

export function ArrowSvg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 65 65" fill="none" className={className}>
      <path
        d="M42.5682 34.2285H18.4102V32.2285H42.5682L30.9842 20.6445L32.4102 19.2285L46.4102 33.2285L32.4102 47.2285L30.9842 45.8125L42.5682 34.2285Z"
        fill="currentColor"
      />
    </svg>
  );
}
