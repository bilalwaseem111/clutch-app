import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function Home() {
  const [clutchPosition, setClutchPosition] = useState(0);
  const [isEngaging, setIsEngaging] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [clutchType, setClutchType] = useState('single');
  const [graphData, setGraphData] = useState([]);
  const [isGraphStopped, setIsGraphStopped] = useState(false);

  useEffect(() => {
    if (isEngaging && clutchPosition < 100 && !isGraphStopped) {
      const interval = setInterval(() => {
        setClutchPosition((prev) => {
          const next = prev + speed / 100;
          setGraphData((data) => [...data, Math.min(next, 100)]);
          return Math.min(next, 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isEngaging, speed, isGraphStopped, clutchPosition]);

  const simulateClutchEngagement = () => {
    setIsEngaging(true);
    setGraphData([]);
    setIsGraphStopped(false);
  };

  const resetSimulation = () => {
    setIsEngaging(false);
    setClutchPosition(0);
    setGraphData([]);
    setIsGraphStopped(false);
  };

  const handleStop = () => setIsGraphStopped(true);
  const handleResume = () => setIsGraphStopped(false);

  const chartData = {
    labels: graphData.map((_, i) => i),
    datasets: [
      {
        label: 'Clutch Engagement %',
        data: graphData,
        fill: true,
        borderColor: '#ff416c',
        backgroundColor: 'rgba(255,65,108,0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Clutch Simulator App</title>
        <meta name="description" content="Visualize and simulate clutch engagement" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-container">
        <header className="header">
          <h1 className="title">Clutch Simulator App</h1>
          <p className="subtitle">Understand, simulate, and visualize clutch behavior in real time</p>
        </header>

        <section className="theory-section">
          <h2 className="theory-heading">Understanding the Clutch</h2>
          <p className="theory-description">
            A clutch is a mechanical device that engages and disengages the power transmission, especially from a driving shaft to a driven shaft.
          </p>
          <ul className="theory-points">
            <li>Transfers power from the engine to the gearbox.</li>
            <li>Allows smooth engagement and disengagement of gear shifts.</li>
            <li>Prevents jerks during gear changes by controlling torque.</li>
            <li>Types: Single Plate, Multi Plate, and Dual Clutch.</li>
            <li>Essential for vehicle control and fuel efficiency.</li>
          </ul>
        </section>

        <section className="controls-section">
          <div className="why-engage-clutch">
            <h3>Why Do We Engage the Clutch?</h3>
            <p>
              Engaging the clutch allows smooth transmission of power from the engine to the wheels. 
              It disconnects the engine while shifting gears, preventing damage and ensuring smoother driving.
            </p>
            <ul>
              <li>Connects engine power to drivetrain smoothly</li>
              <li>Prevents stalling during gear change</li>
              <li>Essential for starting, stopping, and changing speeds</li>
            </ul>
          </div>

          <div className="button-group">
            <button 
              onClick={simulateClutchEngagement} 
              disabled={isEngaging}
              className={`btn primary ${isEngaging ? 'pulse' : ''}`}
            >
              {isEngaging ? 'Engaging...' : 'Engage Clutch'}
            </button>

            <button onClick={resetSimulation} className="btn secondary">
              Reset
            </button>
          </div>

          <div className="options">
            <div className="slider-group">
              <label>Engagement Speed</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={speed} 
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <span>{speed}%</span>
            </div>

            <div className="dropdown-group">
              <label>Clutch Type</label>
              <select value={clutchType} onChange={(e) => setClutchType(e.target.value)}>
                <option value="single">Single Plate</option>
                <option value="multi">Multi Plate</option>
                <option value="dual">Dual Clutch</option>
              </select>
            </div>
          </div>
        </section>

        <section className="graph-section">
          <div className="graph-box-container">
            <div className="graph-header">
              <h2>Clutch Engagement Graph</h2>
              <p>
                This graph displays the clutch engagement percentage over time. 
                As the clutch engages, the line rises — demonstrating a smoother power transfer from the engine to the wheels. 
                It&apos;s useful for analyzing driver behavior, clutch efficiency, and overall gear engagement performance.
              </p>
              <ul className="graph-reasons">
                <li>✰Helps visualize how the clutch engages and disengages over time.</li>
                <li>✰Indicates the smoothness of power transfer between the engine and wheels.</li>
                <li>✰Useful for analyzing driving patterns, including gear changes and engagement speed.</li>
                <li>✰Assists in evaluating clutch performance and overall drivetrain efficiency.</li>
                <li>✰Can be used to optimize driving behavior and improve vehicle control.</li>
              </ul>
            </div>

            <div className="graph-container">
              <Line data={chartData} />
            </div>

            <div className="graph-button-container">
              <button className="animated-stop-button" onClick={handleStop}>
                Stop Graph
              </button>
              <button className="animated-resume-button" onClick={handleResume}>
                Resume Graph
              </button>
            </div> 
          </div>
        </section>

        <footer className="custom-footer">
          <p className="footer-text">
            Made by <strong>Bilal Waseem</strong>
          </p>
          <a
            href="https://www.linkedin.com/in/bilal-waseem-b44006338"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/likindenlogo.png"
              alt="LinkedIn"
              width={28}
              height={28}
              className="linkedin-glow"
            />
          </a>
        </footer>
      </div>
    </>
  );
}
