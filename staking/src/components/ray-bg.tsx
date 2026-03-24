export function RayBg() {
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-80 will-change-transform"
      style={{ transform: "translateZ(0)" }}
      viewBox="0 0 1401 760"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <path
        className="hero-path fill-light-ray dark:fill-dark-ray animate-pulse-ray"
        d="M1127.83 -899.985L1078.63 -1016.77L540.815 553.942L-681.57 31.322L-637.264 135.165L539.676 568.559L1127.83 -899.964V-899.985Z"
        style={{ animationDelay: "0s" }}
      />
      <path
        className="hero-path fill-light-ray dark:fill-dark-ray animate-pulse-ray"
        d="M538.536 584.339L-592.514 239.917L-547.956 344.31L537.029 604.033L1224.65 -670.364L1176.75 -784.043L538.536 584.339Z"
        style={{ animationDelay: "0.5s" }}
      />
      <path
        className="hero-path fill-light-ray dark:fill-dark-ray animate-pulse-ray"
        d="M-503.438 448.637L-456.543 558.509L534.036 642.615L1314.82 -456.291L1273.76 -553.746L535.774 619.812C302.866 581.249 -503.438 448.637 -503.438 448.637Z"
        style={{ animationDelay: "1s" }}
      />
      <path
        className="hero-path fill-light-ray dark:fill-dark-ray animate-pulse-ray"
        d="M1371.67 -321.311L532.323 664.678L-416.673 652.579L-370.841 760.144L530.507 688.053L1419.94 -206.764L1371.67 -321.311Z"
        style={{ animationDelay: "1.5s" }}
      />
    </svg>
  );
}
