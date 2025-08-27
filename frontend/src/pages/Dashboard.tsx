import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  School,
  PlayArrow,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData } from '../types';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardAPI.getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No dashboard data available
      </Alert>
    );
  }

  const chartData = dashboardData.stats.recentScores.map((score, index) => ({
    session: `Session ${index + 1}`,
    score: score,
  }));

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'success';
      case 2: return 'warning';
      case 3: return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your AQA Economics learning journey
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current Proficiency Level */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Current Level</Typography>
              </Box>
              <Box textAlign="center">
                <Chip
                  label={dashboardData.proficiencyLevel.label}
                  color={getDifficultyColor(dashboardData.proficiencyLevel.level) as any}
                  sx={{ mb: 2, fontSize: '1rem', height: '40px' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Level {dashboardData.proficiencyLevel.level} of 3
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(dashboardData.proficiencyLevel.level / 3) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Quick Stats</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Sessions: {dashboardData.stats.totalSessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Score: {dashboardData.stats.averageScore.toFixed(1)}%
                </Typography>
                {dashboardData.stats.recentScores.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Last Score: {dashboardData.stats.recentScores[dashboardData.stats.recentScores.length - 1]}%
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Start Quiz */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PlayArrow color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Ready to Learn?</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Take a new quiz session at your current difficulty level
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStartQuiz}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Score Trends */}
        {dashboardData.stats.recentScores.length > 0 && (
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Score Trends</Typography>
              </Box>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#1976d2"
                      strokeWidth={2}
                      dot={{ fill: '#1976d2' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Weakest Topics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Areas for Improvement
            </Typography>
            {dashboardData.weakestTopics.length > 0 ? (
              <Box>
                {dashboardData.weakestTopics.map((topic, index) => (
                  <Box key={topic.topic} mb={2}>
                    <Typography variant="body1" fontWeight="medium">
                      {index + 1}. {topic.topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy: {topic.accuracy.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attempts: {topic.totalAttempts}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={topic.accuracy}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Take more quizzes to see your areas for improvement
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
