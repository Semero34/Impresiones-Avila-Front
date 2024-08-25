import React, { useState } from 'react';
import {
  Avatar, TextField, Button, Container, Grid, Typography, Paper, LinearProgress, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Edit, Settings } from '@mui/icons-material';
import 'tailwindcss/tailwind.css';

function Profile({ user }) {
  // Mover los hooks fuera de la condición
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileCompleteness, setProfileCompleteness] = useState(85);
  const [openDialog, setOpenDialog] = useState(false);

  // Verificar si el usuario es nulo después de inicializar los hooks
  if (!user) {
    return (
      <Container maxWidth="md" className="my-16">
        <Typography variant="h5" align="center">Error: Usuario no autenticado.</Typography>
      </Container>
    );
  }

  // Establecer los valores iniciales de los hooks después de la verificación de `user`
  if (!profileImage) {
    setProfileImage(`https://i.pravatar.cc/150?u=${user.email}`);
    setImagePreview(`https://i.pravatar.cc/150?u=${user.email}`);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    setProfileImage(imagePreview);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" className="my-16">
      <Paper elevation={4} className="p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#f3e5f5' }}>
        <Grid container spacing={4}>
          {/* Left Column: Profile Image & Completeness */}
          <Grid item xs={12} sm={4} className="text-center">
            <Avatar src={imagePreview} alt={user.username} sx={{ width: 120, height: 120, mb: 2 }} />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="upload-button" />
            <Button variant="contained" color="secondary" component="label" htmlFor="upload-button" className="w-full mb-4">
              <Edit /> Change Picture
            </Button>
            <Typography variant="body1" className="text-gray-700">Profile Completeness: {profileCompleteness}%</Typography>
            <LinearProgress variant="determinate" value={profileCompleteness} className="w-full mt-2" color="secondary" />
            <IconButton color="primary" onClick={handleDialogOpen} className="mt-4">
              <Settings /> Settings
            </IconButton>
          </Grid>

          {/* Right Column: Profile Details */}
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" className="text-purple-700 font-bold mb-6">Profile Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField label="First Name" defaultValue={user.firstName} fullWidth variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Last Name" defaultValue={user.lastName} fullWidth variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" defaultValue={user.email} fullWidth variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone Number" defaultValue={user.phoneNumber} fullWidth variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="City" defaultValue={user.city} fullWidth variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Postal Code" defaultValue={user.postalCode} fullWidth variant="outlined" />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" className="mt-6 w-full bg-purple-600 hover:bg-purple-800 transition-all">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Account Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Manage your account settings here. Change your password, adjust privacy settings, and more.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleDialogClose} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;
