import { Card, CardContent, Typography, CardActions, Button, Box, IconButton } from '@mui/material';
import { Download, PictureAsPdf, Description, InsertDriveFile } from '@mui/icons-material';

export const DocumentCard = ({ document, onDownload }) => {
  const getFileIcon = () => {
    const extension = document.fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PictureAsPdf fontSize="large" color="error" />;
      case 'doc':
      case 'docx':
        return <Description fontSize="large" color="primary" />;
      default:
        return <InsertDriveFile fontSize="large" />;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {getFileIcon()}
          <Box>
            <Typography variant="h6" component="div">
              {document.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {document.fileName}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {document.description}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Subject: {document.subject}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          startIcon={<Download />}
          size="large" 
          variant="contained" 
          fullWidth
          onClick={() => onDownload(document)}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
};
