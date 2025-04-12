import { Card, CardContent, CardActions, Typography, Box } from '@mui/material';

export const DataCard = ({ title, subtitle, content, actions, elevation = 1 }) => {
  return (
    <Card elevation={elevation}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          {content}
        </Box>
      </CardContent>
      {actions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
};
