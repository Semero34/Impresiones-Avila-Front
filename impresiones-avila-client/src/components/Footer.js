import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

function Footer() {
    return (
        <Box sx={{ bgcolor: '#6A1B9A', color: 'white', py: 6, mt: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" className="font-bold mb-4">About Us</Typography>
                        <Typography variant="body2">
                            We bring your ideas to life with high-quality printing services. Our mission is to ensure your complete satisfaction with every print.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" className="font-bold mb-4">Quick Links</Typography>
                        <Box>
                            <Link href="/home" color="inherit" underline="hover" className="block">Home</Link>
                            <Link href="/products" color="inherit" underline="hover" className="block">Products</Link>
                            <Link href="/services" color="inherit" underline="hover" className="block">Services</Link>
                            <Link href="/contacto" color="inherit" underline="hover" className="block">Contact Us</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" className="font-bold mb-4">Stay Connected</Typography>
                        <Box className="flex space-x-4 mb-4">
                            <Link href="https://www.facebook.com" color="inherit"><Facebook /></Link>
                            <Link href="https://www.twitter.com" color="inherit"><Twitter /></Link>
                            <Link href="https://www.instagram.com" color="inherit"><Instagram /></Link>
                            <Link href="https://www.linkedin.com" color="inherit"><LinkedIn /></Link>
                        </Box>
                        <Typography variant="body2">
                            <strong>Email:</strong> info@yourwebsite.com
                        </Typography>
                        <Typography variant="body2">
                            <strong>Phone:</strong> +123 456 7890
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={4} textAlign="center">
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
