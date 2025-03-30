import { Card, CardContent, Typography, CardActions, Button, Box, LinearProgress, Chip } from '@mui/material';
import { Timer, Assignment, Check } from '@mui/icons-material';
import { format } from 'date-fns';

export const TestCard = ({ test, onStart }) => {
  const isAvailable = new Date(test.startTime) <= new Date() && (!test.endTime || new Date(test.endTime) >= new Date());
  const hasStarted = test.startTime && new Date(test.startTime) <= new Date();
  const hasEnded = test.endTime && new Date(test.endTime) <= new Date();

  const getStatusColor = () => {
    if (!hasStarted) return 'warning';
    if (hasEnded) return 'error';
    return 'success';
  };

  const getStatusText = () => {
    if (!hasStarted) return 'Upcoming';
    if (hasEnded) return 'Ended';
    return 'Available';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography gutterBottom variant="h5" component="div">
            {test.title}
          </Typography>
          <Chip 
            label={getStatusText()} 
            color={getStatusColor()} 
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {test.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer fontSize="small" />
            <Typography variant="body2">Duration: {test.duration} minutes</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assignment fontSize="small" />
            <Typography variant="body2">Total Questions: {test.totalQuestions}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Check fontSize="small" />
            <Typography variant="body2">Passing Marks: {test.passingMarks}/{test.totalMarks}</Typography>
          </Box>
        </Box>

        {test.startTime && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Start Time: {format(new Date(test.startTime), 'PPp')}
            </Typography>
            {test.endTime && (
              <Typography variant="subtitle2">
                End Time: {format(new Date(test.endTime), 'PPp')}
              </Typography>
            )}
          </Box>
        )}

        {!hasEnded && !hasStarted && (
          <Box sx={{ width: '100%', mb: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Time until start
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={((new Date() - new Date(test.startTime)) / (new Date(test.endTime) - new Date(test.startTime))) * 100} 
            />
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button 
          size="large" 
          variant="contained" 
          fullWidth
          disabled={!isAvailable}
          onClick={() => onStart(test.id)}
        >
          {hasEnded ? 'View Results' : 'Start Test'}
        </Button>
      </CardActions>
    </Card>
  );
};
