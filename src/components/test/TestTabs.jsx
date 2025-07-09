import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
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
  const [proTabValue, setProTabValue] = useState(0);
  const [subjectTabValue, setSubjectTabValue] = useState(0);
  
  const categories = [
    { label: 'Current Tests', content: <TestList type="current" /> },
    { label: 'Previous Tests', content: <TestList type="previous" /> },
    { label: 'Upcoming Tests', content: <TestList type="upcoming" /> },
    { label: 'Performance', content: <TestAnalytics /> },
    { label: 'Free Test', content: null },
    { label: 'Pro', content: null }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleProTabChange = (event, newValue) => {
    setProTabValue(newValue);
  };
  
  const handleSubjectTabChange = (event, newValue) => {
    setSubjectTabValue(newValue);
  };
  
  const handleTestSelection = (testType) => {
    // Navigate to the appropriate test page or handle test selection
    console.log(`Selected test type: ${testType}`);
    // Example: navigate(`/tests/${testType}`);
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
        {/* Standard Tab Panels */}
        {categories.slice(0, 4).map((category, index) => (
          <TabPanel key={index} value={value} index={index}>
            {category.content}
          </TabPanel>
        ))}
        
        {/* Free Test Tab Panel */}
        <TabPanel value={value} index={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Free Practice Tests
            </Typography>
            <Typography variant="body2" paragraph>
              Access our free practice tests to prepare for your exams.
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={() => handleTestSelection('free')} 
              sx={{ mt: 2 }}
            >
              Start Free Test
            </Button>
          </Box>
        </TabPanel>
        
        {/* Pro Tab Panel */}
        <TabPanel value={value} index={5}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Premium Test Options
            </Typography>
            
            {/* Pro Options Tabs */}
            <Tabs 
              value={proTabValue} 
              onChange={handleProTabChange} 
              variant="fullWidth"
              sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="MCQs" />
              <Tab label="PYQs" />
              <Tab label="Subject-wise" />
            </Tabs>
            
            {/* MCQs Tab Content */}
            {proTabValue === 0 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" paragraph>
                  Practice with our premium multiple-choice questions.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => handleTestSelection('mcq')} 
                  sx={{ mt: 1 }}
                >
                  Start MCQ Test
                </Button>
              </Box>
            )}
            
            {/* PYQs Tab Content */}
            {proTabValue === 1 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" paragraph>
                  Practice with previous year questions.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => handleTestSelection('pyq')} 
                  sx={{ mt: 1 }}
                >
                  Start PYQ Test
                </Button>
              </Box>
            )}
            
            {/* Subject-wise Tab Content */}
            {proTabValue === 2 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" paragraph>
                  Choose a specific subject area to practice.
                </Typography>
                
                {/* Subject Options Tabs */}
                <Tabs 
                  value={subjectTabValue} 
                  onChange={handleSubjectTabChange} 
                  variant="fullWidth"
                  sx={{ mb: 2 }}
                >
                  <Tab label="NTA" />
                  <Tab label="UGC NET" />
                  <Tab label="JRF" />
                </Tabs>
                
                {/* NTA Tab Content */}
                {subjectTabValue === 0 && (
                  <Box sx={{ p: 1 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleTestSelection('nta')} 
                      sx={{ mt: 1 }}
                    >
                      Start NTA Test
                    </Button>
                  </Box>
                )}
                
                {/* UGC NET Tab Content */}
                {subjectTabValue === 1 && (
                  <Box sx={{ p: 1 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleTestSelection('ugc-net')} 
                      sx={{ mt: 1 }}
                    >
                      Start UGC NET Test
                    </Button>
                  </Box>
                )}
                
                {/* JRF Tab Content */}
                {subjectTabValue === 2 && (
                  <Box sx={{ p: 1 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleTestSelection('jrf')} 
                      sx={{ mt: 1 }}
                    >
                      Start JRF Test
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}
