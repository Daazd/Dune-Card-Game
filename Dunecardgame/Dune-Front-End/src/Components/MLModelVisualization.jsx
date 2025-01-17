// MLModelVisualization.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const MLModelVisualization = () => {
  const [scatterData, setScatterData] = useState([]);
  const [pollInterval, setPollInterval] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [eventSource, setEventSource] = useState(null);
  const [demoState, setDemoState] = useState('idle');
  const [realtimeData, setRealtimeData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [featureImportance, setFeatureImportance] = useState([
    { feature: 'Time Pattern', importance: 0.35 },
    { feature: 'IP History', importance: 0.25 },
    { feature: 'Keyboard Dynamics', importance: 0.20 },
    { feature: 'Geographic Location', importance: 0.15 },
    { feature: 'Device Signature', importance: 0.05 }
  ]);

  const darkTheme = {
    background: '#1a1a1a',
    paper: '#2d2d2d',
    text: '#ffffff',
    grid: '#404040',
    chart: {
      normal: '#00ff00',
      suspicious: '#f44336',
      feature: '#2196f3',
      line: '#2196f3'
    }
  };

  const API_BASE = 'http://localhost:8000/api';

  const generateScatterPoint = (type) => {
    if (type === 'normal') {
      return {
        x: Math.random() * 0.3,  // Cluster in bottom-left
        y: Math.random() * 0.3,
        type: 'normal'
      };
    } else {
      return {
        x: 0.7 + (Math.random() * 0.3),  // Cluster in top-right
        y: 0.7 + (Math.random() * 0.3),
        type: 'suspicious'
      };
    }
  };

  const securityService = {
    startSimulation: async (type) => {
        const response = await fetch(`${API_BASE}/simulation/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    connectEvents: () => {
        return new window.EventSource(`${API_BASE}/events/`);  // Use window.EventSource
    }
  };

  useEffect(() => {
    const cleanupEventSource = () => {
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
    };

    return cleanupEventSource;
  }, [eventSource]);

  // Update runMLAnalysis function
  const runMLAnalysis = async (type) => {
    setDemoState(type);
    setIsSimulating(true);
    setScatterData([]); 
    
    try {
      await securityService.startSimulation(type);
      
      // Start with initial data based on type
      const baseAnomalyScore = type === 'normal' ? 0.3 : 0.8;
      
      const interval = setInterval(() => {
        setScatterData(prev => {
          const newData = [...prev];
          if (newData.length > 30) newData.shift();
          
          let point;
          switch(type) {
            case 'normal':
              // Normal login patterns - low anomaly scores, tight clustering
              point = {
                x: 0.2 + (Math.random() * 0.1), // Time pattern score
                y: baseAnomalyScore + (Math.random() * 0.1), // Anomaly score
                type: 'normal'
              };
              break;
              
            case 'attack':
              // Brute force patterns - high anomaly scores, tight clustering
              point = {
                x: 0.8 + (Math.random() * 0.1), // Very regular timing
                y: baseAnomalyScore + (Math.random() * 0.1), // High anomaly
                type: 'suspicious'
              };
              break;
              
            case 'suspicious':
              // Suspicious patterns - medium-high scores, more scattered
              point = {
                x: 0.6 + (Math.random() * 0.2), // More varied timing
                y: baseAnomalyScore - (Math.random() * 0.2), // Variable anomaly
                type: 'suspicious'
              };
              break;
          }
          
          return [...newData, point];
        });
      }, 1000);
  
      setPollInterval(interval);
      
    } catch (error) {
      console.error('ML Analysis failed:', error);
      setIsSimulating(false);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const stopDemo = () => {
    setDemoState('idle');
    setAlerts([]);
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  };
  
  const [clusterData, setClusterData] = useState([]);
  const [modelAccuracy, setModelAccuracy] = useState([]);

  useEffect(() => {
    // Simulate real-time cluster data
    const generateClusterData = () => {
      const newData = [];
      // Generate normal behavior cluster
      for (let i = 0; i < 20; i++) {
        newData.push({
          x: Math.random() * 0.3,
          y: Math.random() * 0.3,
          type: 'normal'
        });
      }
      // Generate suspicious behavior cluster
      for (let i = 0; i < 5; i++) {
        newData.push({
          x: 0.7 + Math.random() * 0.3,
          y: 0.7 + Math.random() * 0.3,
          type: 'suspicious'
        });
      }
      setClusterData(newData);
    };

    generateClusterData();
    const interval = setInterval(generateClusterData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate model accuracy over time
    const generateAccuracyData = () => {
      const baseAccuracy = 0.95;
      const data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          timestamp: `T${i}`,
          accuracy: baseAccuracy + (Math.random() * 0.05 - 0.025),
          falsePositive: Math.random() * 0.05
        });
      }
      setModelAccuracy(data);
    };

    generateAccuracyData();
  }, []);

  return (
    <>
      <Paper sx={{ p: 3, mb: 2, bgcolor: darkTheme.paper }}>
            <Typography variant="h5" gutterBottom sx={{ color: darkTheme.text }}>
              ML Model Controls
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => runMLAnalysis('normal')}
              >
                Analyze Normal Pattern
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => runMLAnalysis('attack')}
              >
                Analyze Attack Pattern
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => runMLAnalysis('suspicious')}
              >
                Analyze Suspicious Pattern
              </Button>
              <Button
                variant="contained"
                onClick={stopDemo}
                disabled={demoState === 'idle'}
              >
                Stop Demo
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 2, bgcolor: darkTheme.paper }}>
            <Typography variant="h5" gutterBottom sx={{ color: darkTheme.text }}>
              ML Model Decision Space
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkTheme.grid} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Time Pattern" 
                    stroke={darkTheme.text}
                    tick={{ fill: darkTheme.text }}
                  />
                  <YAxis 
                    type="number"
                    dataKey="y" 
                    name="Behavior Score"
                    domain={[0, 1]}
                    stroke={darkTheme.text}
                    tick={{ fill: darkTheme.text }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: darkTheme.paper, borderColor: darkTheme.grid }}
                    labelStyle={{ color: darkTheme.text }}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: darkTheme.text }}>{value}</span>}
                  />
                  <Scatter
                    name="Normal Behavior"
                    data={scatterData.filter(d => d.type === 'normal' || d.type === 'Normal Behavior')}
                    fill={darkTheme.chart.normal}
                    stroke="#ffffff"
                    strokeWidth={1}
                    fillOpacity={0.8}
                    r={6}
                  />
                  <Scatter
                    name="Suspicious Behavior"
                    data={scatterData.filter(d => d.type === 'suspicious' || d.type === 'Suspicious Behavior')}
                    fill={darkTheme.chart.suspicious}
                    stroke="#ffffff"
                    strokeWidth={1}
                    fillOpacity={0.8}
                    r={6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mb: 2, bgcolor: darkTheme.paper }}>
            <Typography variant="h5" gutterBottom sx={{ color: darkTheme.text }}>
              Feature Importance
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={featureImportance}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkTheme.grid} />
                  <XAxis 
                    dataKey="feature" 
                    stroke={darkTheme.text}
                    tick={{ fill: darkTheme.text }}
                  />
                  <YAxis 
                    stroke={darkTheme.text}
                    tick={{ fill: darkTheme.text }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: darkTheme.paper, borderColor: darkTheme.grid }}
                    labelStyle={{ color: darkTheme.text }}
                  />
                  <Bar dataKey="importance" fill={darkTheme.chart.feature} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: darkTheme.paper }}>
            <Typography variant="h5" gutterBottom sx={{ color: darkTheme.text }}>
              Model Performance Over Time
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={modelAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkTheme.grid} />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke={darkTheme.text}
                    tick={{ fill: darkTheme.text }}
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    stroke={darkTheme.text}
                    tick={{ fill: darkTheme.text }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: darkTheme.paper, borderColor: darkTheme.grid }}
                    labelStyle={{ color: darkTheme.text }}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: darkTheme.text }}>{value}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke={darkTheme.chart.normal}
                    name="Detection Accuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="falsePositive"
                    stroke={darkTheme.chart.suspicious}
                    name="False Positive Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
    </>
  );  
};  

export default MLModelVisualization;