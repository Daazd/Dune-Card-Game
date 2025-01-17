import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CottageIcon from '@mui/icons-material/Cottage';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && (
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color: '#673ab7',
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <CottageIcon fontSize="large" />
        </IconButton>
      )}
      {children}
    </>
  );
};

export default Layout;