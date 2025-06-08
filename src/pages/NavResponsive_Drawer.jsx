import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { useUser, SignOutButton } from '@clerk/clerk-react';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
    display: 'block',
  };

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/About' },
    { name: 'Contact', path: '/Contact' },
  ];

  const DrawerList = (
    <Box
      sx={{ width: 250, marginTop: '80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton component={Link} to={page.path} style={linkStyle}>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {isSignedIn ? (
          <SignOutButton>
            <button className="w-full text-sm px-4 py-2 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 transition">
              Logout
            </button>
          </SignOutButton>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link to="/login?mode=signin" style={linkStyle}>
              <button className="w-full text-sm px-4 py-2 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50 transition">
                Login
              </button>
            </Link>
            <Link to="/login?mode=signup" style={linkStyle}>
              <button className="w-full text-sm px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition">
                Sign Up
              </button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer}>
        {open ? (
          <CloseIcon sx={{ color: 'black' }} />
        ) : (
          <MenuIcon sx={{ color: 'black' }} />
        )}
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
