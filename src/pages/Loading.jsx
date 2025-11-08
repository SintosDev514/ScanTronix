// LoadingBar.jsx
import "../style/Loading.css";

const LoadingBar = ({ progress }) => {
  return (
    <div id="X">
      <div id="bar" style={{ width: `${progress}%` }}></div>
      <p id="percent">{progress}%</p>
    </div>
  );
};

export default LoadingBar;
