import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  TrendingUp,
  Repeat,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { QuizResult } from '../types';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const result = location.state?.result as QuizResult;

  if (!result) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        No quiz results found. Please take a quiz first.
      </Alert>
    );
  }

  const scorePercentage = (result.score / 100) * 100;
  const isImprovement = result.newDifficultyLevel > result.oldDifficultyLevel;
  const isDecline = result.newDifficultyLevel < result.oldDifficultyLevel;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const topicPerformance = result.results.reduce((acc, question) => {
    if (!acc[question.topic]) {
      acc[question.topic] = { correct: 0, total: 0 };
    }
    acc[question.topic].total++;
    if (question.isCorrect) {
      acc[question.topic].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  return (
    <Box>
      {/* Results Header */}
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        
        <Box display="flex" justifyContent="center" alignItems="center" gap={4} mb={3}>
          <Box>
            <Typography variant="h2" color={getScoreColor(result.score)}>
              {result.score.toFixed(1)}%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Overall Score
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h3" color="primary">
              {result.correctAnswers}/{result.totalQuestions}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Correct Answers
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h3" color="text.secondary">
              {formatTime(result.timeSpent)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Time Taken
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={scorePercentage}
          sx={{ height: 10, borderRadius: 5, mb: 2 }}
        />

        {/* Difficulty Level Change */}
        {isImprovement && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp />
              <Typography>
                Great job! You've advanced from {getDifficultyLabel(result.oldDifficultyLevel)} to {getDifficultyLabel(result.newDifficultyLevel)}
              </Typography>
            </Box>
          </Alert>
        )}
        
        {isDecline && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography>
              Your difficulty level has been adjusted from {getDifficultyLabel(result.oldDifficultyLevel)} to {getDifficultyLabel(result.newDifficultyLevel)} to help you build stronger foundations
            </Typography>
          </Alert>
        )}
        
        {!isImprovement && !isDecline && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography>
              You're staying at {getDifficultyLabel(result.newDifficultyLevel)} level. Keep practicing to improve!
            </Typography>
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Topic Performance */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance by Topic
              </Typography>
              {Object.entries(topicPerformance).map(([topic, stats]) => {
                const accuracy = (stats.correct / stats.total) * 100;
                return (
                  <Box key={topic} mb={2}>
                    <Typography variant="body2" fontWeight="medium">
                      {topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.correct}/{stats.total} correct ({accuracy.toFixed(0)}%)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={accuracy}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Results */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Question Review
          </Typography>
          {result.results.map((question, index) => (
            <Accordion key={question.questionId} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  {question.isCorrect ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                  <Box flexGrow={1}>
                    <Typography variant="body1">
                      Question {index + 1}
                    </Typography>
                    <Chip label={question.topic} size="small" variant="outlined" />
                  </Box>
                  <Typography
                    variant="body2"
                    color={question.isCorrect ? 'success.main' : 'error.main'}
                  >
                    {question.isCorrect ? 'Correct' : 'Incorrect'}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    {question.question}
                  </Typography>
                  
                  <Box mb={2}>
                    {question.options.map((option, optionIndex) => (
                      <Box
                        key={optionIndex}
                        sx={{
                          p: 1,
                          mb: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            optionIndex === question.correctAnswer
                              ? 'success.light'
                              : optionIndex === question.userAnswer && !question.isCorrect
                              ? 'error.light'
                              : 'transparent',
                          opacity:
                            optionIndex === question.correctAnswer ||
                            optionIndex === question.userAnswer
                              ? 1
                              : 0.7,
                        }}
                      >
                        <Typography variant="body2">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                          {optionIndex === question.correctAnswer && ' ✓'}
                          {optionIndex === question.userAnswer &&
                            !question.isCorrect &&
                            ' (Your answer)'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {question.explanation && (
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Explanation:</strong> {question.explanation}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="contained"
          startIcon={<Repeat />}
          onClick={() => navigate('/quiz')}
        >
          Take Another Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default Results;
