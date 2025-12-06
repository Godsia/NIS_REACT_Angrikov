import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { PetCard } from '../components/PetCard/PetCard';
import { EventLog } from '../components/EventLog/EventLog';
import { Pet } from '../components/PetCard/types';
import petsData from '../data/pets.json';

export const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [eventLogOpen, setEventLogOpen] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPets(petsData as Pet[]);
      setLoading(false);
    };

    loadPets();
  }, []);

  const speciesList = useMemo(() => {
    const species = new Set(pets.map((pet) => pet.species));
    return Array.from(species).sort();
  }, [pets]);

  // Filter
  const filteredPets = useMemo(() => {
    if (selectedSpecies === 'all') {
      return pets;
    }
    return pets.filter((pet) => pet.species === selectedSpecies);
  }, [pets, selectedSpecies]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h3" color='white' component="h1" sx={{ fontWeight: 700 }}>
          Кибер-Зоопарк 2077
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="species-filter-label">Вид питомца</InputLabel>
            <Select
              labelId="species-filter-label"
              value={selectedSpecies}
              label="Вид питомца"
              onChange={(e) => setSelectedSpecies(e.target.value)}
            >
              <MenuItem value="all">Все виды</MenuItem>
              {speciesList.map((species) => (
                <MenuItem key={species} value={species}>
                  {species}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            color="primary"
            onClick={() => setEventLogOpen(true)}
            sx={{ fontSize: '2rem' }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredPets.length === 0 ? (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="h6" align="center" sx={{ py: 4 }}>
                Питомцы не найдены
              </Typography>
            </Box>
          ) : (
            filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))
          )}
        </Box>
      )}

      <EventLog open={eventLogOpen} onClose={() => setEventLogOpen(false)} />
    </Container>
  );
};

