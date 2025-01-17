// UnifiedSecurityDashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, Button, Alert, Tabs, Tab } from '@mui/material';
import MLModelVisualization from './MLModelVisualization';
import { useNavigate } from 'react-router-dom';
// import EventSource from './EventSource';
import { use } from 'react';

const UnifiedSecurityDashboard = () => {
  const [demoState, setDemoState] = useState('idle');
  const [alerts, setAlerts] = useState([]);
  const [realtimeData, setRealtimeData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const [pollInterval, setPollInterval] = useState(null);
  
  const API_BASE = 'http://localhost:8000/api';

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

  // Historical data
  const loginAttempts = [
    { date: '2024-01-01', normal: 120, suspicious: 5, blocked: 2 },
    { date: '2024-01-02', normal: 115, suspicious: 8, blocked: 3 },
    { date: '2024-01-03', normal: 125, suspicious: 3, blocked: 1 },
    { date: '2024-01-04', normal: 118, suspicious: 12, blocked: 6 },
    { date: '2024-01-05', normal: 130, suspicious: 4, blocked: 2 }
  ];

  const securityMetrics = [
    { name: 'Detection Rate', before: 45, after: 95 },
    { name: 'False Positives', before: 15, after: 3 },
    { name: 'Response Time', before: 2000, after: 150 },
    { name: 'Security Score', before: 65, after: 92 }
  ];

  const darkTheme = {
    background: '#1a1a1a',
    paper: '#2d2d2d',
    text: '#ffffff',
    grid: '#404040',
    chart: {
      normal: '#4caf50',
      suspicious: '#f44336',
      feature: '#2196f3'
    }
  };

  // Real-time data simulation
  useEffect(() => {
    if (demoState !== 'idle') {
      const interval = setInterval(() => {
        setRealtimeData(prev => {
          const newPoint = generateDataPoint(demoState);
          return [...prev.slice(-19), newPoint];
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [demoState]);

  const generateDataPoint = (state) => {
    const now = new Date();
    switch(state) {
      case 'normal':
        return {
          time: now.toISOString(),
          score: Math.random() * 0.3,
          type: 'normal'
        };
      case 'bruteforce':
        return {
          time: now.toISOString(),
          score: 0.7 + Math.random() * 0.3,
          type: 'attack'
        };
      case 'anomaly':
        return {
          time: now.toISOString(),
          score: 0.5 + Math.random() * 0.4,
          type: 'suspicious'
        };
      default:
        return {
          time: now.toISOString(),
          score: 0,
          type: 'idle'
        };
    }
  };

  const stopDemo = () => {
    setDemoState('idle');
    setAlerts([]);
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  };

  const startDemo = async (type) => {
    setDemoState(type);
    setAlerts([]);
    setRealtimeData([]); // Clear previous data
    
    try {
        await securityService.startSimulation(type);
        
        // Store interval ID in state
        const intervalId = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE}/events/`);
                const data = await response.json();
                
                setRealtimeData(prev => {
                    const newData = [...prev];
                    if (newData.length >= 20) {
                        newData.shift();
                    }
                    
                    const formattedTime = new Date().toLocaleTimeString();
                    
                    let score;
                    switch(type) {
                        case 'normal':
                            score = Math.random() * 0.3;
                            break;
                        case 'bruteforce':
                            score = data.data.blocked ? 1.0 : 0.8;
                            break;
                        case 'anomaly':
                            score = 0.6 + Math.random() * 0.2;
                            break;
                        default:
                            score = 0;
                    }
                    
                    return [...newData, {
                        time: formattedTime,
                        score: score,
                        type: type
                    }];
                });
            } catch (error) {
                console.error('Error polling events:', error);
            }
        }, 1000);
        
        setPollInterval(intervalId);
    } catch (error) {
        console.error('Failed to start simulation:', error);
        setAlerts(prev => [...prev, {
            severity: 'error',
            message: 'Failed to start simulation'
        }]);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  // const startDemo = async (type) => {
  //     setDemoState(type);
  //     setAlerts([]);

  //     try {
  //         await securityService.startSimulation(type);

  //         // Setup event source for real-time updates
  //         const eventSource = new EventSource('http://localhost:8000/api/events/');

  //         eventSource.onmessage = (event) => {
  //             const data = JSON.parse(event.data);

  //             switch(data.type) {
  //                 case 'brute_force_attempt':
  //                     if(data.data.blocked) {
  //                         setAlerts(prev => [...prev, {
  //                             severity: 'error',
  //                             message: `Brute Force Attack Detected! Attempt ${data.data.attempt} blocked`
  //                         }]);
  //                     }
  //                     setRealtimeData(prev => [...prev.slice(-19), {
  //                         time: new Date(data.timestamp * 1000).toISOString(),
  //                         score: data.data.blocked ? 0.9 : 0.7,
  //                         type: 'attack'
  //                     }]);
  //                     break;

  //                 case 'suspicious_behavior':
  //                     setRealtimeData(prev => [...prev.slice(-19), {
  //                         time: new Date(data.timestamp * 1000).toISOString(),
  //                         score: 0.6,
  //                         type: 'suspicious'
  //                     }]);
  //                     break;
  //             }
  //         };

  //         return () => eventSource.close();
  //     } catch (error) {
  //         console.error('Failed to start simulation:', error);
  //         setAlerts(prev => [...prev, {
  //             severity: 'error',
  //             message: 'Failed to start simulation'
  //         }]);
  //     }
  // };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 4, bgcolor: darkTheme.background }}>
      <Paper sx={{ mb: 2, bgcolor: darkTheme.paper }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': { color: darkTheme.text },
            '& .Mui-selected': { color: darkTheme.chart.feature }
          }}
        >
          <Tab label="Real-time Monitoring" />
          <Tab label="Security Metrics" />
          <Tab label="ML Model Analysis" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" gutterBottom>Live Security Monitoring</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => startDemo('normal')}
              disabled={demoState !== 'idle'}
            >
              Normal Usage Demo
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => startDemo('bruteforce')}
              disabled={demoState !== 'idle'}
            >
              Brute Force Attack Demo
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => startDemo('anomaly')}
              disabled={demoState !== 'idle'}
            >
              Suspicious Behavior Demo
            </Button>
            <Button
              variant="contained"
              onClick={stopDemo}
              disabled={demoState === 'idle'}
            >
              Stop Demo
            </Button>
          </Box>

          <Box sx={{ height: 400, mb: 2 }}>
            <ResponsiveContainer>
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                  dataKey="time" 
                  interval="preserveStartEnd"
                  tick={{ fontSize: 12 }}
              />
              <YAxis 
                  domain={[0, 1]} 
                  ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tick={{ fontSize: 12 }}
              />
              <Tooltip 
                  formatter={(value) => value.toFixed(2)}
                  labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2196f3"
                  name="Anomaly Score"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  isAnimationActive={false}
              />
            </LineChart>
            </ResponsiveContainer>
          </Box>

          {alerts.map((alert, index) => (
            <Alert key={index} severity={alert.severity} sx={{ mb: 1 }}>
              {alert.message}
            </Alert>
          ))}
        </Paper>
      )}

      {tabValue === 1 && (
        <>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h5" gutterBottom>Login Activity History</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={loginAttempts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="normal" stroke="#2196f3" name="Normal Logins" />
                  <Line type="monotone" dataKey="suspicious" stroke="#ff9800" name="Suspicious Attempts" />
                  <Line type="monotone" dataKey="blocked" stroke="#f44336" name="Blocked Attempts" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Security Improvements</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={securityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" fill="#ff9800" name="Before Implementation" />
                  <Bar dataKey="after" fill="#4caf50" name="After Implementation" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </>
      )}
      {tabValue === 2 && (
        <MLModelVisualization />
      )}
    </Box>
  );
};

export default UnifiedSecurityDashboard;