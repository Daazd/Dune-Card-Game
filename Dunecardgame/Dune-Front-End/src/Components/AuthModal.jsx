// src/Components/AuthModal.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';

const AuthModal = ({ open, handleClose, handleSubmit, isLogin, error, setUsername, setPassword, setEmail }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            label="Username"
            variant="filled"
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          {!isLogin && (
            <TextField
              label="Email"
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          )}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;



