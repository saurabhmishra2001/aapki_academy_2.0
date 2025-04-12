import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const PageHeader = ({ title, breadcrumbs }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {title}
      </Typography>
      {breadcrumbs && (
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={crumb.path}
              component={RouterLink}
              to={crumb.path}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              sx={{ textDecoration: 'none' }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
    </Box>
  );
};
