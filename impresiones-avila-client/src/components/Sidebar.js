import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, People, Receipt, Person, ListAlt, AccountBalanceWallet, Store, Business } from '@mui/icons-material'; // Asegúrate de importar los íconos necesarios

const drawerWidth = 240;

const Sidebar = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                style={{
                    width: drawerWidth,
                    flexShrink: 0
                }}
            >
                <Toolbar />
                <div style={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText primary="Inicio" />
                        </ListItem>
                        <ListItem button component={Link} to="/clientes">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Clientes" />
                        </ListItem>
                        <ListItem button component={Link} to="/ventas">
                            <ListItemIcon><Receipt /></ListItemIcon>
                            <ListItemText primary="Ventas" />
                        </ListItem>
                        <ListItem button component={Link} to="/usuarios">
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Usuarios" />
                        </ListItem>
                        <ListItem button component={Link} to="/reportes">
                            <ListItemIcon><ListAlt /></ListItemIcon>
                            <ListItemText primary="Reporte" />
                        </ListItem>
                        <ListItem button component={Link} to="/expenses">
    <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
    <ListItemText primary="Gastos" />
</ListItem>

                        <ListItem button component={Link} to="/products">
                            <ListItemIcon><Store /></ListItemIcon>
                            <ListItemText primary="Productos" />
                        </ListItem>
                        <ListItem button component={Link} to="/suppliers">
                            <ListItemIcon><Business /></ListItemIcon>
                            <ListItemText primary="Proveedores" />
                        </ListItem>
                        {/* Enlaces adicionales para órdenes y facturas */}
                        <ListItem button component={Link} to="/admin/orders">
                            <ListItemIcon><ListAlt /></ListItemIcon>
                            <ListItemText primary="Órdenes" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/invoices">
                            <ListItemIcon><Receipt /></ListItemIcon>
                            <ListItemText primary="Facturas" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default Sidebar;
