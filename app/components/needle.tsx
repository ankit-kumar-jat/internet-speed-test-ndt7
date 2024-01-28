import React, { FC, SVGProps } from "react";

const Needle: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 320 320"
    width={320}
    height={320}
    {...props}
  >
    <defs>
      <linearGradient id="a" x1={0} x2={0} y1={1} y2={0}>
        <stop offset={0} stopColor="#0A5CA7" stopOpacity={0} />
        <stop offset={0.3} stopColor="#0A5CA7" stopOpacity={0.75} />
        <stop offset={1} stopColor="#1877F2" />
      </linearGradient>
      <path id="b" fill="url(#a)" d="M23 121H0L6 16h11z" />
    </defs>
    <use xlinkHref="#b" x={148.561} y={55.5} />
  </svg>
);
export default Needle;
