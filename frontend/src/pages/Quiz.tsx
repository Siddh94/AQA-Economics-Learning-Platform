import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Timer, Assignment } from '@mui/icons-material';
import { QuizSession } from '../types';
import { sessionsAPI } from '../services/api';

const Quiz: React.FC = () => {
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const session = await sessionsAPI.createSession();
        setQuizSession(session);
        setAnswers(new Array(session.questions.length).fill(-1));
        setStartTime(Date.now());
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start quiz session');
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
  }, []);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestionIndex < quizSession!.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // Set selected answer if already answered
        if (newAnswers[currentQuestionIndex + 1] !== -1) {
          setSelectedAnswer(newAnswers[currentQuestionIndex + 1]);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = [...answers];
      if (selectedAnswer !== null) {
        newAnswers[currentQuestionIndex] = selectedAnswer;
        setAnswers(newAnswers);
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] !== -1 ? answers[currentQuestionIndex - 1] : null);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer !== null && quizSession) {
      const finalAnswers = [...answers];
      finalAnswers[currentQuestionIndex] = selectedAnswer;
      
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      setSubmitting(true);
      try {
        const result = await sessionsAPI.submitSession(quizSession.sessionId, {
          answers: finalAnswers,
          timeSpent,
        });
        
        navigate(`/results/${quizSession.sessionId}`, { 
          state: { result } 
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to submit quiz');
        setSubmitting(false);
      }
    }
  };

  const isLastQuestion = currentQuestionIndex === (quizSession?.questions.length || 0) - 1;
  const currentQuestion = quizSession?.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (quizSession?.questions.length || 1)) * 100;
  const answeredQuestions = answers.filter(a => a !== -1).length + (selectedAnswer !== null ? 1 : 0);

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

  if (!quizSession || !currentQuestion) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No quiz session available
      </Alert>
    );
  }

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
      {/* Quiz Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            AQA Economics Quiz
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={<Assignment />}
              label={`Level ${quizSession.difficultyLevel}`}
              color={getDifficultyColor(quizSession.difficultyLevel) as any}
            />
            <Chip
              icon={<Timer />}
              label={`${Math.floor((Date.now() - startTime) / 60000)}:${((Date.now() - startTime) % 60000 / 1000).toFixed(0).padStart(2, '0')}`}
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {quizSession.questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Answered: {answeredQuestions}/{quizSession.questions.length}
          </Typography>
        </Box>
        
        <LinearProgress variant="determinate" value={progress} />
      </Paper>

      {/* Question */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box mb={3}>
            <Chip
              label={currentQuestion.topic}
              size="small"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              {currentQuestion.text}
            </Typography>
          </Box>

          <RadioGroup
            value={selectedAnswer !== null ? selectedAnswer.toString() : ''}
            onChange={handleAnswerChange}
          >
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={
                  <Typography variant="body1">
                    {String.fromCharCode(65 + index)}. {option}
                  </Typography>
                }
                sx={{ 
                  mb: 1,
                  '& .MuiFormControlLabel-label': { 
                    width: '100%' 
                  }
                }}
              />
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Box>
          {!isLastQuestion ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={selectedAnswer === null || submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Submit Quiz'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Quiz;
