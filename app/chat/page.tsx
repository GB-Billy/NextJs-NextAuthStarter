'use client';

import React from 'react';
import { Box, Divider, Paper, TextField, Button, IconButton, createTheme, ThemeProvider, CssBaseline, CircularProgress, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121', // Slightly more black
      paper: '#333333',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
});

const ChatPage = () => {
  const [message, setMessage] = React.useState('');
  const [systemInstructions, setSystemInstructions] = React.useState('');
  const [messages, setMessages] = React.useState<{ text: string; sender: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Load system instructions from local storage on component mount
  React.useEffect(() => {
    const savedInstructions = localStorage.getItem('systemInstructions');
    if (savedInstructions) {
      setSystemInstructions(savedInstructions);
    }
  }, []);

  const handleSaveInstructions = () => {
    localStorage.setItem('systemInstructions', systemInstructions);
    alert('Instructions saved!');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents adding a new line in the text field
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages, systemInstructions }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { text: data.response, sender: 'ai' }]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, something went wrong.', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%', bgcolor: 'background.default' }}>
      {/* Left Panel (30%) */}
      <Box sx={{ width: '30%', height: '100%', p: 2 }}>
        <Paper sx={{ height: '100%', p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TextField
              label="System Instructions"
              multiline
              rows={10}
              variant="outlined"
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              sx={{ flexGrow: 1, mb: 2 }}
            />
            <Button variant="contained" onClick={handleSaveInstructions}>
              Save
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Right Panel (70%) */}
      <Box sx={{ width: '70%', height: '100%', p: 2 }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Chat messages will go here */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper sx={{ p: 1, backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.700', color: 'text.primary' }}>
                  {msg.text}
                </Paper>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={handleSendMessage} disabled={!message.trim() || isLoading}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
    </ThemeProvider>
  );
};

export default ChatPage;
