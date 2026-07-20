import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Analytics,
  BugReport,
  TrendingUp,
  Dashboard,
  Speed,
  History,
  Agriculture,
  WbSunny,
  Opacity,
  Thermostat,
  LocalFlorist,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Dashboard',
    description: 'Real-time overview of farm metrics, weather conditions, and predictive insights',
    icon: <Dashboard />,
    color: '#667eea',
    path: '/dashboard',
    stats: 'Live Data',
  },
  {
    title: 'Comprehensive Analysis',
    description: 'AI-powered analysis of soil, weather, and crop conditions for optimal farming decisions',
    icon: <Analytics />,
    color: '#764ba2',
    path: '/analysis',
    stats: 'ML Models',
  },
  {
    title: 'Pest Detection',
    description: 'Early detection and identification of pest threats with actionable recommendations',
    icon: <BugReport />,
    color: '#f59e0b',
    path: '/pest-detection',
    stats: '95% Accuracy',
  },
  {
    title: 'Market Prediction',
    description: 'Forecast crop prices and market trends to optimize harvest timing and sales',
    icon: <TrendingUp />,
    color: '#10b981',
    path: '/market-prediction',
    stats: 'Price Forecasts',
  },
  {
    title: 'Performance Monitoring',
    description: 'Track system performance, API health, and data processing metrics',
    icon: <Speed />,
    color: '#ef4444',
    path: '/performance',
    stats: 'Real-time',
  },
  {
    title: 'Data History',
    description: 'Access historical analyses, predictions, and farming data for trend analysis',
    icon: <History />,
    color: '#8b5cf6',
    path: '/data-history',
    stats: 'MongoDB',
  },
];

const metrics = [
  { label: 'Farm Analyses', value: '1,245+', icon: <LocalFlorist />, color: '#667eea' },
  { label: 'Predictions Made', value: '8,932', icon: <Analytics />, color: '#10b981' },
  { label: 'Pest Detections', value: '432', icon: <BugReport />, color: '#f59e0b' },
  { label: 'Active Farmers', value: '2,104', icon: <Agriculture />, color: '#764ba2' },
];

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

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: 40,
                }}
              >
                🌾
              </Avatar>
            </Box>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 800,
                mb: 2,
              }}
            >
              Smart Agriculture Analytics
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Empowering farmers with AI-driven insights for sustainable and profitable agriculture
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mb: 4 }}
            >
              <Chip icon={<WbSunny />} label="Weather Analysis" color="primary" variant="outlined" />
              <Chip icon={<Opacity />} label="Soil Monitoring" color="primary" variant="outlined" />
              <Chip icon={<Thermostat />} label="Climate Data" color="primary" variant="outlined" />
              <Chip icon={<LocalFlorist />} label="Crop Optimization" color="primary" variant="outlined" />
            </Stack>
          </motion.div>
        </Box>

        {/* Metrics Section */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: metric.color,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color={metric.color}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: feature.color,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: feature.color,
                          mr: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {feature.title}
                        </Typography>
                        <Chip
                          label={feature.stats}
                          size="small"
                          sx={{
                            bgcolor: `${feature.color}20`,
                            color: feature.color,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(feature.path)}
                      sx={{
                        bgcolor: feature.color,
                        '&:hover': {
                          bgcolor: feature.color,
                          filter: 'brightness(0.9)',
                        },
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Explore {feature.title}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Footer Info */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              mt: 6,
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Ready to Transform Your Farm?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 600, mx: 'auto' }}>
              Join thousands of farmers using AI-powered analytics to increase yields, reduce costs, 
              and make data-driven farming decisions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Get Started Now
            </Button>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
}

export default HomePage;