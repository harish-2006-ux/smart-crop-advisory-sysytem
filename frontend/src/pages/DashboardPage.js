import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Agriculture,
  WbSunny,
  Opacity,
  BugReport,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';

// Mock data for demo purposes
const yieldData = [
  { month: 'Jan', yield: 4200 },
  { month: 'Feb', yield: 4350 },
  { month: 'Mar', yield: 4500 },
  { month: 'Apr', yield: 4600 },
  { month: 'May', yield: 4700 },
  { month: 'Jun', yield: 4850 },
];

const cropDistribution = [
  { name: 'Wheat', value: 30, color: '#667eea' },
  { name: 'Rice', value: 25, color: '#764ba2' },
  { name: 'Corn', value: 20, color: '#f59e0b' },
  { name: 'Soybean', value: 15, color: '#10b981' },
  { name: 'Cotton', value: 10, color: '#ef4444' },
];

const weatherData = [
  { day: 'Mon', temp: 22, humidity: 65, rainfall: 0 },
  { day: 'Tue', temp: 24, humidity: 70, rainfall: 5 },
  { day: 'Wed', temp: 21, humidity: 75, rainfall: 12 },
  { day: 'Thu', temp: 23, humidity: 68, rainfall: 0 },
  { day: 'Fri', temp: 25, humidity: 62, rainfall: 0 },
  { day: 'Sat', temp: 26, humidity: 60, rainfall: 8 },
  { day: 'Sun', temp: 24, humidity: 66, rainfall: 3 },
];

const kpiCards = [
  {
    title: 'Total Farmers',
    value: '1,245',
    change: '+12%',
    trend: 'up',
    icon: <Agriculture />,
    color: '#667eea',
  },
  {
    title: 'Average Yield',
    value: '4,850 kg/ha',
    change: '+8%',
    trend: 'up',
    icon: <TrendingUp />,
    color: '#10b981',
  },
  {
    title: 'Market Price',
    value: '₹2,450/q',
    change: '-5%',
    trend: 'down',
    icon: <TrendingDown />,
    color: '#f59e0b',
  },
  {
    title: 'Pest Risk',
    value: 'Medium',
    change: '3 regions',
    trend: 'up',
    icon: <BugReport />,
    color: '#ef4444',
  },
];

function DashboardPage() {
  const { data: performanceData, isLoading } = useQuery(
    'performance',
    apiService.getPerformance,
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Farm Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time overview of your agricultural operations and insights
            </Typography>
          </Box>
        </motion.div>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiCards.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: kpi.color,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      {kpi.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">
                        {kpi.title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {kpi.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={kpi.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    label={kpi.change}
                    color={kpi.trend === 'up' ? 'success' : 'warning'}
                    size="small"
                  />
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Yield Trend Chart */}
          <Grid item xs={12} md={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Yield Trend (Last 6 Months)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="yield"
                      stroke="#667eea"
                      fill="url(#colorYield)"
                    />
                    <defs>
                      <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* Crop Distribution */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Crop Distribution
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={cropDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {cropDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={3}>
          {/* Weather Conditions */}
          <Grid item xs={12} md={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Weather Conditions (7 Days)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="temp" fill="#f59e0b" name="Temperature (°C)" />
                    <Bar dataKey="humidity" fill="#667eea" name="Humidity (%)" />
                    <Bar dataKey="rainfall" fill="#10b981" name="Rainfall (mm)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* System Status */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  System Status
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">API Health</Typography>
                      <Typography variant="body2" color="success.main">98%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={98}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'success.main',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Data Processing</Typography>
                      <Typography variant="body2" color="info.main">85%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'info.main',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Storage Usage</Typography>
                      <Typography variant="body2" color="warning.main">72%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={72}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'warning.main',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Paper
                    sx={{
                      p: 2,
                      mt: 3,
                      bgcolor: 'success.50',
                      border: '1px solid',
                      borderColor: 'success.200',
                    }}
                  >
                    <Typography variant="body2" color="success.main" fontWeight="600">
                      ✅ All systems operational
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {new Date().toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}

export default DashboardPage;