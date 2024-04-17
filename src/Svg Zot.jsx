import { motion } from 'framer-motion';

const SvgZot = ({ style = {}, width, color = 'white', done = null, viewBox = '0 0 100 100' }) => {
  const opacity = done ? 0.35 : 0.05;

  return (
    <motion.svg id="svg-zot" style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg"
      animate={{ opacity }} transition={{ duration: 1 }}>
      <polygon fill={color} strokeLinejoin="round" points="64,0 99,0 47,46 71,47 1,99 0,99 35,60 13,60" />
    </motion.svg>

  );
};

export default SvgZot;
