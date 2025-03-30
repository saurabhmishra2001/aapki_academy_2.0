import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import TestList from './TestList';
import TestAnalytics from './TestAnalytics';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `test-tab-${index}`,
    'aria-controls': `test-tabpanel-${index}`,
  };
}

export default function TestTabs() {
  const [value, setValue] = useState(0);
  const categories = [
    { label: 'Current Tests', content: <TestList type="current" /> },
    { label: 'Previous Tests', content: <TestList type="previous" /> },
    { label: 'Upcoming Tests', content: <TestList type="upcoming" /> },
    { label: 'Performance', content: <TestAnalytics /> }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'primary.main',
        borderRadius: '16px 16px 0 0',
        boxShadow: 2
      }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#fff'
            }
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#fff'
              }
            }
          }}
        >
          {categories.map((category, index) => (
            <Tab 
              key={category.label}
              label={category.label}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: '0 0 16px 16px',
        boxShadow: 2
      }}>
        {categories.map((category, index) => (
          <TabPanel key={index} value={value} index={index}>
            {category.content}
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}
