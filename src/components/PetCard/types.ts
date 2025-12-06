export type PetMood = 'happy' | 'neutral' | 'sad' | 'excited' | 'tired';

export interface Pet {
  id: number;
  name: string;
  species: string;
  mood: PetMood;
  energy: number;
  level: number;
  avatar: string;
}

export type PetAction = 
  | { type: 'FEED'; payload?: number }
  | { type: 'LEVEL_UP' }
  | { type: 'CHEER' }
  | { type: 'RESET'; payload: Pet }
  | { type: 'DECREASE_ENERGY' }
  | { type: 'UPDATE_MOOD'; payload: PetMood };

