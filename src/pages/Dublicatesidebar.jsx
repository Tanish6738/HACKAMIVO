import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

// Import Icons
import { FaHome } from 'react-icons/fa';
import { MdOutlineLocalLibrary } from 'react-icons/md';
import { TbMoodPlus } from 'react-icons/tb';
import { LuBot } from 'react-icons/lu';
import { MdPeopleAlt } from 'react-icons/md';
import { CgGames } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';
import Item1 from './Item1'; // Import your Item1 component

// 1. Custom Tab Component for better styling control
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
    fontSize: '1rem', // Slightly increased font size
    '& .MuiTab-iconWrapper': {
        marginBottom: '0 !important',
        marginRight: theme.spacing(1.5), // Increased space between icon and text
        fontSize: '1.2rem', // Increased icon size
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

// 2. Define a custom Material-UI theme
const customTheme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // A shade of green
        },
        success: {
            main: '#4caf50', // Green for selected state
            light: '#e8f5e9', // Lighter green for selected background
        },
        action: {
            hover: '#f5f5f5', // Light gray for hover
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        fontSize: 16, // Base font size for the theme
    },
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const [value, setValue] = React.useState(0);

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
        { label: 'Support', icon: <IoSettingsOutline /> },
    ];

    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Tabs
                    orientation="vertical"
                    variant="standard"
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
                    {/* Conditional rendering of content based on the selected tab */}
                    {value === 0 && (
                        <Box>
                            <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                                Dashboard
                            </Typography>
                            <Item1 /> {/* Render Item1 when Dashboard is selected */}
                        </Box>
                    )}
                    {value !== 0 && (
                        tabsData.map((tab, index) => {
                        if (index !== 0) { //avoid rendering dashboard again
                            return(
                            <TabPanel key={index} value={value} index={index}>
                                <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                                    {tab.label}
                                </Typography>
                                <Typography>
                                    This is the content for the {tab.label} section. You can place your specific components and information here.
                                </Typography>
                            </TabPanel>
                        )}
                        })
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}