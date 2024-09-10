import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Home from './components/Home';
import Login from './components/Login';
import ClientList from './components/ClientList';
import AddClient from './components/AddClient';
import EditClient from './components/EditClient'; 
import Register from './components/Register';
import SalesList from './components/SalesList';
import AddSale from './components/AddSale';
import UserReport from './components/UserReport';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import TransactionOverview from './components/TransactionOverview';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import ReportCategories from './components/ReportCategories';
import ClientReport from './components/ClientReport';
import SalesReport from './components/SalesReport';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import SupplierList from './components/SupplierList';
import AddSupplier from './components/AddSupplier';
import EditSupplier from './components/EditSupplier';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import Confirmation from './components/Confirmation';
import AdminOrders from './components/AdminOrders';
import AdminInvoices from './components/AdminInvoices';
import InvoiceDetail from './components/InvoiceDetail'; 
import Contacto from './components/Contacto'; 
import AboutUs from './components/AboutUs'; 
import Footer from './components/Footer'; 
import OrderDetails from './components/OrderDetails';
import FinancialReport from './components/FinancialReport';  
import Expenses from './components/Expenses';
import InventoryReport from './components/InventoryReport';
import Success from './components/Success';
import CreateCoupon from './components/CreateCoupon';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar el GoogleOAuthProvider


import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';

// Configura tu clave pública de Stripe
const stripePromise = loadStripe('pk_live_51Pq155FUO5MxqxqNsqLMdjSCfnjoT4YXmRUpVWFBHk0CqsH20UViGbB6OESLA8Qlp7kcHSTyVvxWfIg2n9kK2r8l00bMopwTXK');

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error al parsear el usuario almacenado:", error);
            }
        }
    }, []);
    

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('role', loggedInUser.role);
    };

   return (
        <GoogleOAuthProvider clientId="84712141875-lpv4s7oq6jb4g26t7686cepnsfvobcn5.apps.googleusercontent.com"> {/* Envuelve la app con GoogleOAuthProvider */}
            <Elements stripe={stripePromise}>
                <Router>
                    <Navbar user={user} setUser={setUser} />
                    <Box sx={{ display: 'flex' }}>
                        {user && user.role === 'admin' && <Sidebar role={user.role} />}
                        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                            <Toolbar />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login setUser={handleLogin} />} />
                                <Route path="/clientes" element={<ClientList />} />
                                <Route path="/add-client" element={<AddClient />} />
                                <Route path="/edit-client/:id" element={<EditClient />} />
                                <Route path="/ventas" element={<SalesList />} />
                                <Route path="/add-sale" element={<AddSale />} />
                                <Route path="/reportes/usuarios" element={<UserReport />} />
                                <Route path="/usuarios" element={<UserList />} />
                                <Route path="/edit-user/:id" element={<EditUser />} />
                                <Route path="/transactions/:clientId" element={<TransactionList />} />
                                <Route path="/add-transaction" element={<AddTransaction />} />
                                <Route path="/transactions" element={<TransactionOverview />} />
                                <Route path="/generate-general-report" element={<TransactionOverview />} />
                                <Route path="/generate-client-report/:clientId" element={<TransactionList />} />
                                <Route path="/product-detail/:productId" element={<ProductDetail />} />
                                <Route path="/products" element={<ProductList />} />
                                <Route path="/add-product" element={<AddProduct />} />
                                <Route path="/edit-product/:id" element={<EditProduct />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/profile" element={<Profile user={user} />} />
                                <Route path="/reportes" element={<ReportCategories />} />
                                <Route path="/reportes/clientes" element={<ClientReport />} />
                                <Route path="/reportes/ventas" element={<SalesReport />} />
                                <Route path="/suppliers" element={<SupplierList />} />
                                <Route path="/add-supplier" element={<AddSupplier />} />
                                <Route path="/edit-supplier/:id" element={<EditSupplier />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password/:token" element={<ResetPassword />} />
                                <Route path="/confirmation" element={<Confirmation />} />
                                <Route path="/admin/orders" element={<AdminOrders />} />
                                <Route path="/admin/invoices" element={<AdminInvoices />} />
                                <Route path="/invoice/:id" element={<InvoiceDetail />} />
                                <Route path="/contacto" element={<Contacto />} />
                                <Route path="/footer" element={<Footer />} />
                                <Route path="/acerca" element={<AboutUs />} />
                                <Route path="/reportes/financieros" element={<FinancialReport />} /> 
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="/reportes/inventario" element={<InventoryReport />} /> 
                                <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminOrders /> : <Home />} />
                                <Route path="/admin/order/:orderId" element={<OrderDetails />} />
                                <Route path="/success" element={<Success />} />
                                <Route path="/createcoupon" element={user?.role === 'admin' ? <CreateCoupon /> : <Home />} />
                            </Routes>
                        </Box>
                    </Box>
                    <Footer />
                </Router>
            </Elements>
        </GoogleOAuthProvider> 
    );
}

export default App;
