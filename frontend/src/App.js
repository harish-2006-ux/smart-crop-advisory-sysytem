import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';

// Layout Components
import Layout from './components/Layout/Layout';

// Page Components
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import PestDetectionPage from './pages/PestDetectionPage';
import MarketPredictionPage from './pages/MarketPredictionPage';
import PerformancePage from './pages/PerformancePage';
import DataHistoryPage from './pages/DataHistoryPage';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function App() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <DashboardPage />
              </motion.div>
            }
          />
          <Route
            path="/analysis"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AnalysisPage />
              </motion.div>
            }
          />
          <Route
            path="/pest-detection"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PestDetectionPage />
              </motion.div>
            }
          />
          <Route
            path="/market-prediction"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <MarketPredictionPage />
              </motion.div>
            }
          />
          <Route
            path="/performance"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PerformancePage />
              </motion.div>
            }
          />
          <Route
            path="/data-history"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <DataHistoryPage />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;