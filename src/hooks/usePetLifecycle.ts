import { useEffect } from 'react';
import { PetMood } from '../components/PetCard/types';

interface UsePetLifecycleProps {
  energy: number;
  onEnergyDecrease: () => void;
  onMoodUpdate: (mood: PetMood) => void;
  intervalSeconds?: number;
}

export const usePetLifecycle = ({
  energy,
  onEnergyDecrease,
  onMoodUpdate,
  intervalSeconds = 5,
}: UsePetLifecycleProps) => {
  useEffect(() => {
    // Update mood based on energy
    const updateMoodFromEnergy = () => {
      if (energy <= 0) {
        onMoodUpdate('tired');
      } else if (energy <= 20) {
        onMoodUpdate('sad');
      } else if (energy <= 40) {
        onMoodUpdate('neutral');
      } else if (energy <= 70) {
        onMoodUpdate('happy');
      } else {
        onMoodUpdate('excited');
      }
    };

    updateMoodFromEnergy();
  }, [energy, onMoodUpdate]);

  useEffect(() => {
    if (energy <= 0) {
      return; // Pet is unavailable, stop decreasing energy
    }

    const interval = setInterval(() => {
      onEnergyDecrease();
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [energy, onEnergyDecrease, intervalSeconds]);
};

