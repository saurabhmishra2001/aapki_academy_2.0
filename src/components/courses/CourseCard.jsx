import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box, Chip } from '@mui/material';
import { PlayCircleOutline, Description } from '@mui/icons-material';

export const CourseCard = ({ course, onEnroll }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={course.thumbnail || 'https://via.placeholder.com/300x140'}
        alt={course.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {course.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayCircleOutline />
            <Typography variant="body2">{course.videoCount || 0} Videos</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Description />
            <Typography variant="body2">{course.documentCount || 0} Docs</Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="large" 
          variant="contained" 
          fullWidth
          onClick={() => onEnroll(course.id)}
        >
          {course.enrolled ? 'Continue Learning' : 'Enroll Now'}
        </Button>
      </CardActions>
    </Card>
  );
};
