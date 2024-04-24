const SvgX = ({ style = {}, width, color = 'white', viewBox = '0 0 100 100' }) => {
  return (
    <svg id="svg-x" style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect width="100%" fill="#0000" stroke="none" />
        <path stroke='black' strokeWidth="6" fill="none" strokeLinejoin="round" d="M38,38 L66,66 M38,66 L66,38" />
        <path stroke={color} strokeWidth="6" fill="none" strokeLinejoin="round" d="M36,36 L64,64 M36,64 L64,36" />
      </g>
    </svg>
  );
};

export default SvgX;
