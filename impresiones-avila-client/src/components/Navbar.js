import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import CartButton from './CartButton';

function Navbar({ user, setUser, cartItemCount }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <AppBar position="fixed" style={{ backgroundColor: '#d7bde2', boxShadow: 'none', paddingTop: 0, paddingBottom: 0 }}>
                <Toolbar className="flex justify-between">
                    <div className="flex items-center">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleSidebar}
                            style={{ marginRight: '16px' }}
                        >
                            <MenuIcon style={{ color: '#4a235a' }} />
                        </IconButton>
                        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: '#4a235a', fontWeight: 'bold' }}>
                            Impresiones Avila
                        </Typography>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <Button component={Link} to="/" style={{ color: '#4a235a', fontWeight: 'bold' }}>Inicio</Button>
                        <Button component={Link} to="/acerca" style={{ color: '#4a235a', fontWeight: 'bold' }}>Acerca de Nosotros</Button>
                        <Button component="a" href="#productos" style={{ color: '#4a235a', fontWeight: 'bold' }}>Productos</Button>
                        <Button component={Link} to="/contacto" style={{ color: '#4a235a', fontWeight: 'bold' }}>Contáctenos</Button>
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
                                >
                                    <AccountCircle style={{ color: '#4a235a' }} />
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
                            <Button component={Link} to="/login" color="inherit" style={{ color: '#4a235a', fontWeight: 'bold' }}>
                                Iniciar Sesión
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            {/* Toolbar to push down the content */}
            <Toolbar />
            <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
                <div className="w-64">
                    <div className="p-4 text-lg font-bold">Impresiones Avila</div>
                    <List>
                        <ListItem button component={Link} to="/" onClick={toggleSidebar}>
                            <ListItemText primary="Inicio" />
                        </ListItem>
                        <ListItem button component={Link} to="/clientes" onClick={toggleSidebar}>
                            <ListItemText primary="Clientes" />
                        </ListItem>
                        <ListItem button component={Link} to="/ventas" onClick={toggleSidebar}>
                            <ListItemText primary="Ventas" />
                        </ListItem>
                        <ListItem button component={Link} to="/usuarios" onClick={toggleSidebar}>
                            <ListItemText primary="Usuarios" />
                        </ListItem>
                        <ListItem button component={Link} to="/reportes" onClick={toggleSidebar}>
                            <ListItemText primary="Reportes" />
                        </ListItem>
                        <ListItem button component={Link} to="/transactions" onClick={toggleSidebar}>
                            <ListItemText primary="Transacciones" />
                        </ListItem>
                        <ListItem button component={Link} to="/products" onClick={toggleSidebar}>
                            <ListItemText primary="Productos" />
                        </ListItem>
                        <ListItem button component={Link} to="/suppliers" onClick={toggleSidebar}>
                            <ListItemText primary="Proveedores" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    );
}

export default Navbar;
