import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import NavResponsive_Drawer from '../pages/NavResponsive_Drawer';
import StarIcon from '@mui/icons-material/Star';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import Logo from "../images/logo.jpg"; // Assuming you have a logo image


const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
};

const pages = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/Contact' },
];

function ResponsiveAppBar() {
  const { isSignedIn } = useUser();

  return (
      <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "white",
        color:isSignedIn ? '#CCCCFF' : 'white',
        borderBottom: '1px solid #e0e0e0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl" >
        <Toolbar disableGutters sx={{ width: '100%', display: 'flex'  }}>
          {/* Logo / Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' ,}}>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
               color:"black",
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                marginLeft: 2,
              }}
            >
             <img src={Logo} alt=""  className='h-24 ml-4'/>
              
            </Typography>
          </Box>

          {/* Mobile Menu Icon - Hide if signed in (already implemented correctly) */}
          <Box
            sx={{
              display: { xs: isSignedIn ? 'none' : 'flex', md: 'none' },
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <NavResponsive_Drawer />
            </IconButton>
          </Box>

          {/* Desktop Nav Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {/* Conditional rendering for desktop navigation links */}
            {isSignedIn ? (
              <Button
                component={Link}
                to="/dashboard"
                sx={{
                  color: '#333',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    color: 'green',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Dashboard
              </Button>
            ) : (
              pages.map((page, index) => (
                <Button
                  key={index}
                  component={Link}
                  to={page.path}
                  sx={{
                    color: '#333',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      color: 'green',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {page.label}
                </Button>
              ))
            )}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: { md: 'flex' }, gap: 2, ml: 'auto' }}>
            {isSignedIn ? (
              <SignOutButton>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#fdecea',
                      borderColor: '#d32f2f',
                    },
                  }}
                >
                  Logout
                </Button>
              </SignOutButton>
            ) : (
              // This block only renders when isSignedIn is FALSE
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}> {/* Modified line */}
                <Button
                  component={Link}
                  to="/login?mode=signin"
                  variant="outlined"
                  sx={{
                    borderColor: "purple",
                    textTransform: 'none',
                    color:"black",
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: isSignedIn? '#e8f5e9':"#ccccff",
                       borderColor: 'purple',
                       color: 'white',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/login?mode=signup"
                  variant="contained"
                 sx={{
                    borderColor: "purple",
                    textTransform: 'none',
                    color:"black",
                    fontWeight: 500,
                    backgroundColor: "#ccccff",
                    '&:hover': {
                      backgroundColor: "#ccccff",
                       borderColor: 'purple',
                       color: 'white',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;