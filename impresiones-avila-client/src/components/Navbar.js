import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import CartButton from './CartButton';

function Navbar({ user, setUser, cartItemCount }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user'); 
        localStorage.removeItem('token');
        handleClose();
    };

    return (
        <>
            <AppBar position="fixed" style={{ backgroundColor: '#6A1B9A', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', padding: '0.5rem 1rem' }}>
                <Toolbar className="flex justify-between">
                    <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        Impresiones Avila
                    </Typography>
                    <div className="hidden md:flex items-center space-x-4">
                        <Button component={Link} to="/" style={{ color: '#FFFFFF', fontWeight: 'bold', borderRadius: '8px', padding: '0.5rem 1rem', transition: 'background-color 0.3s, transform 0.3s' }} className="hover:bg-purple-700 hover:scale-105">
                            Inicio
                        </Button>
                        <Button component={Link} to="/acerca" style={{ color: '#FFFFFF', fontWeight: 'bold', borderRadius: '8px', padding: '0.5rem 1rem', transition: 'background-color 0.3s, transform 0.3s' }} className="hover:bg-purple-700 hover:scale-105">
                            Acerca de Nosotros
                        </Button>
                        <Button component="a" href="#productos" style={{ color: '#FFFFFF', fontWeight: 'bold', borderRadius: '8px', padding: '0.5rem 1rem', transition: 'background-color 0.3s, transform 0.3s' }} className="hover:bg-purple-700 hover:scale-105">
                            Productos
                        </Button>
                        <Button component={Link} to="/contacto" style={{ color: '#FFFFFF', fontWeight: 'bold', borderRadius: '8px', padding: '0.5rem 1rem', transition: 'background-color 0.3s, transform 0.3s' }} className="hover:bg-purple-700 hover:scale-105">
                            Contáctenos
                        </Button>
                    </div>
                    <div className="flex items-center">
                        <CartButton cartItemCount={cartItemCount} />
                        {user ? (
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                    style={{ color: '#FFFFFF' }}
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose} component={Link} to="/profile">Perfil</MenuItem>
                                    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button component={Link} to="/login" color="inherit" style={{ color: '#FFFFFF', fontWeight: 'bold', borderRadius: '8px', padding: '0.5rem 1rem', transition: 'background-color 0.3s, transform 0.3s' }} className="hover:bg-purple-700 hover:scale-105">
                                Iniciar Sesión
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
}

export default Navbar;
