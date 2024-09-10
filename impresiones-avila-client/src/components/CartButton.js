import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

function CartButton() {
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartItemCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(cart.reduce((count, item) => count + item.quantity, 0));
    };

    useEffect(() => {
        updateCartItemCount();

        const handleCartUpdated = () => {
            updateCartItemCount();
        };

        const handleCartEmptied = () => {
            setCartItemCount(0);
        };

        window.addEventListener('cart-updated', handleCartUpdated);
        window.addEventListener('cart-emptied', handleCartEmptied);
        window.addEventListener('order-completed', handleCartEmptied);

        // Limpieza del evento cuando el componente se desmonta
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdated);
            window.removeEventListener('cart-emptied', handleCartEmptied);
            window.removeEventListener('order-completed', handleCartEmptied);
        };
    }, []);

    return (
        <IconButton 
            component={Link} 
            to="/cart" 
            color="inherit"
        >
            <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart style={{ color: 'white' }} />
            </Badge>
        </IconButton>
    );
}

export default CartButton;
