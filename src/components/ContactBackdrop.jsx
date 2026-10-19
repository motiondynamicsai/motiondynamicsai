import FooterBall from './FooterBall';

// Vector reconstruction of the supplied brand wave, kept to a few smooth
// Bézier segments so the ribbon, outline and dot stay crisp at any density.
export default function ContactBackdrop() {
  return <svg className="footer-wave" viewBox="0 0 1280 500" focusable="false">
    <g transform="translate(0 180)">
      <g className="footer-wave-curves" aria-hidden="true">
        <path d="M330 320 C586 318 805 265 979 164 C1094 96 1194 72 1280 70" fill="none" stroke="#d9d8d2" strokeWidth="1.25" />
        <path d="M378 320 C614 318 817 270 994 168 C1097 109 1199 82 1280 76 L1280 105 C1187 116 1100 151 1007 201 C837 292 695 318 558 320 Z" fill="#111110" />
        <path d="M652 320 C817 311 942 286 1066 245 C1151 216 1220 199 1280 192 L1280 320 Z" fill="#8f2b2b" />
      </g>
      <FooterBall />
    </g>
  </svg>;
}
