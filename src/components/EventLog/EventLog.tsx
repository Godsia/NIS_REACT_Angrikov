import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { useEventLog } from '../../hooks/useEventLog';

interface EventLogProps {
  open: boolean;
  onClose: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ open, onClose }) => {
  const { events, clearEvents } = useEventLog();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          backgroundColor: '#1a1a2e',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ color: '#fff' }}>
            Системный лог событий
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={clearEvents}
            disabled={events.length === 0}
          >
            Очистить
          </Button>
        </Box>

        <Paper
          sx={{
            backgroundColor: '#16213e',
            maxHeight: 'calc(100vh - 120px)',
            overflow: 'auto',
          }}
        >
          {events.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Лог событий пуст
              </Typography>
            </Box>
          ) : (
            <List>
              {events.map((event, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemText
                    primary={event}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '13px',
                        color: '#e0e0e0',
                        fontFamily: 'monospace',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Drawer>
  );
};

