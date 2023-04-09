import styles from "../styles/Progress.module.css";
import { useEffect, useRef } from "react";

const Progress = ({ start, end }) => {
  const circleRef = useRef();

  useEffect(() => {
    circleRef.current.style.strokeDashoffset = 200;
  }, []);

  return (
    <div className={styles.progress}>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div id={styles.number}>65%</div>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="160px"
        height="160px"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <defs>
          <linearGradient id="GradientColor">
            <stop offset="0%" stop-color="#e91e63" />
            <stop offset="100%" stop-color="#673ab7" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="70" stroke-linecap="round" ref={circleRef} />
      </svg>
    </div>
  );
};

export default Progress;
