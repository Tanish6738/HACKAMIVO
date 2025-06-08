import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { FaHome } from 'react-icons/fa';
import { MdOutlineLocalLibrary, MdPeopleAlt } from 'react-icons/md';
import { TbMoodPlus } from 'react-icons/tb';
import { LuBot } from 'react-icons/lu';
import { CgGames } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';
import Item1 from '../pages/Item1';
import TabPanel from './TabPanel'; // Use the separate file if extracted

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minHeight: 48,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  '& .MuiTab-iconWrapper': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5),
    fontSize: '1.2rem',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  '&.Mui-selected': {
    color: theme.palette.success.main,
    backgroundColor: theme.palette.success.light,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const customTheme = createTheme({
  palette: {
    primary: { main: '#4caf50' },
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
    },
    action: {
      hover: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    fontSize: 16,
  },
});

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs({ value, setValue }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsData = [
    { label: 'Dashboard', icon: <FaHome /> },
    { label: 'Library', icon: <MdOutlineLocalLibrary /> },
    { label: 'Mood Tracker', icon: <TbMoodPlus /> },
    { label: 'AI Suggestion', icon: <LuBot /> },
    { label: 'Community', icon: <MdPeopleAlt /> },
    { label: 'Games', icon: <CgGames /> },
    { label: 'csv2json', icon: <IoSettingsOutline /> },
  ];

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{
            minWidth: 180,
            borderRight: '1px solid',
            borderColor: 'divider',
            boxShadow: '2px 0px 5px -2px rgba(0,0,0,0.1)',
            '& .MuiTabs-indicator': {
              backgroundColor: customTheme.palette.success.main,
              left: 0,
              width: '4px',
            },
            '& .MuiTabs-scroller': {
              overflowY: 'hidden !important',
            },
          }}
        >
          {tabsData.map((tab, index) => (
            <StyledTab
              key={index}
              label={tab.label}
              icon={tab.icon}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          {value === 0 && (
            <Box>
              <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                Dashboard
              </Typography>
              <Item1 />
            </Box>
          )}
          {tabsData.map((tab, index) => {
            if (index !== 0) {
              return (
                <TabPanel key={index} value={value} index={index}>
                  <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                    {tab.label}
                  </Typography>
                  <Typography>
                    This is the content for the {tab.label} section.
                  </Typography>
                </TabPanel>
              );
            }
            return null;
          })}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
