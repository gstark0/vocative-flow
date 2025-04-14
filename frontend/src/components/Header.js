
import React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { Link } from 'react-router-dom';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import Button from '@mui/joy/Button';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { logout } = useAuth();

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
            borderBottom: '1px solid #ccc',
        }}>
            <Box
                component='img'
                src={logo}
                alt='Logo'
                width={200}
            >
            </Box>

            <Box>
                <Button
                    variant='plain'
                    color='primary'
                    startDecorator={<LogoutOutlined />}
                    component={Link}
                    onClick={logout}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    )
}