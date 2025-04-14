// File: src/components/Dashboard/LeftSidebar.jsx
import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/joy';
import { SmartToyOutlined, CodeOutlined } from '@mui/icons-material';

export default function LeftSidebar({ onAddNode, onRemoveNode }) {
    return (
        <Box sx={{
            width: 250,
            backgroundColor: 'background.level1',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            <Typography level="h5" sx={{ marginBottom: 2 }}>Controls</Typography>
            <Button variant="outlined" onClick={() => onAddNode('ai_node')} startDecorator={<SmartToyOutlined />}>
                New AI Node
            </Button>
            <Button variant="outlined" onClick={() => onAddNode('code_node')} startDecorator={<CodeOutlined />}>
                New Code Node
            </Button>
            <Divider />
            <Typography level="body2">Other Actions</Typography>
        </Box>
    );
}