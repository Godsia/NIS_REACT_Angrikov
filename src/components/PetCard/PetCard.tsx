import React, { useReducer, useCallback, useRef, useEffect, memo } from 'react';
import { Pet, PetAction, PetMood } from './types';
import { useEventLog } from '../../hooks/useEventLog';
import { usePetLifecycle } from '../../hooks/usePetLifecycle';
import styles from './PetCard.module.scss';
import { ActionButton } from '../PetActions/ActionButton.styled';

interface PetCardProps {
  pet: Pet;
}

const petReducer = (state: Pet, action: PetAction): Pet => {
  switch (action.type) {
    case 'FEED':
      return {
        ...state,
        energy: Math.min(100, state.energy + (action.payload || 20)),
      };
    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1,
      };
    case 'CHEER':
      const newMood: PetMood = 
        state.mood === 'sad' ? 'neutral' :
        state.mood === 'neutral' ? 'happy' :
        state.mood === 'happy' ? 'excited' :
        'excited';
      return {
        ...state,
        mood: newMood,
      };
    case 'RESET':
      return action.payload;
    case 'DECREASE_ENERGY':
      return {
        ...state,
        energy: Math.max(0, state.energy - 5),
      };
    case 'UPDATE_MOOD':
      return {
        ...state,
        mood: action.payload,
      };
    default:
      return state;
  }
};

const PetCardComponent: React.FC<PetCardProps> = ({ pet: initialPet }) => {
  const [pet, dispatch] = useReducer(petReducer, initialPet);
  const { addEvent } = useEventLog();
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleFeed = useCallback(() => {
    dispatch({ type: 'FEED' });
    addEvent(`${pet.name} был накормлен (+20 энергии)`);
  }, [pet.name, addEvent]);

  const handleLevelUp = useCallback(() => {
    dispatch({ type: 'LEVEL_UP' });
    addEvent(`${pet.name} повысил уровень до ${pet.level + 1}!`);
  }, [pet.name, pet.level, addEvent]);

  const handleCheer = useCallback(() => {
    dispatch({ type: 'CHEER' });
    addEvent(`${pet.name} получил заботу и внимание`);
  }, [pet.name, addEvent]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET', payload: initialPet });
    addEvent(`${pet.name} был сброшен до исходного состояния`);
  }, [pet.name, initialPet, addEvent]);

  const handleEnergyDecrease = useCallback(() => {
    dispatch({ type: 'DECREASE_ENERGY' });
  }, []);

  const handleMoodUpdate = useCallback((mood: PetMood) => {
    dispatch({ type: 'UPDATE_MOOD', payload: mood });
  }, []);

  usePetLifecycle({
    energy: pet.energy,
    onEnergyDecrease: handleEnergyDecrease,
    onMoodUpdate: handleMoodUpdate,
  });

  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.style.transform = 'scale(1.1)';
      const timeout = setTimeout(() => {
        if (avatarRef.current) {
          avatarRef.current.style.transform = 'scale(1)';
        }
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [pet.mood, pet.energy]);

  const isUnavailable = pet.energy <= 0;

  const getShadowStyle = (): React.CSSProperties => {
    const shadows: Record<PetMood, string> = {
      excited: '0 8px 24px rgba(0, 255, 0, 0.4)',
      happy: '0 6px 20px rgba(0, 200, 255, 0.3)',
      neutral: '0 4px 12px rgba(128, 128, 128, 0.2)',
      sad: '0 2px 8px rgba(255, 0, 0, 0.2)',
      tired: '0 1px 4px rgba(0, 0, 0, 0.3)',
    };
    return { boxShadow: shadows[pet.mood] };
  };

  return (
    <div 
      className={`${styles.petCard} ${isUnavailable ? styles.unavailable : ''}`}
      style={getShadowStyle()}
    >
      <div className={styles.header}>
        <div 
          ref={avatarRef}
          className={styles.avatar}
          style={{ transition: 'transform 0.2s ease' }}
        >
          {pet.avatar}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{pet.name}</h3>
          <p className={styles.species}>{pet.species}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Уровень:</span>
          <span className={styles.value}>{pet.level}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Настроение:</span>
          <span className={`${styles.value} ${styles.mood}`}>{pet.mood}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Энергия:</span>
          <div className={styles.energyBar}>
            <div 
              className={styles.energyFill}
              style={{ width: `${pet.energy}%` }}
            />
            <span className={styles.energyValue}>{pet.energy}%</span>
          </div>
        </div>
      </div>

      {isUnavailable ? (
        <div className={styles.unavailableMessage}>
          Питомец недоступен (энергия = 0)
        </div>
      ) : (
        <div className={styles.actions}>
          <ActionButton onClick={handleFeed} variant="feed">
            Feed
          </ActionButton>
          <ActionButton onClick={handleLevelUp} variant="levelup">
            Level Up
          </ActionButton>
          <ActionButton onClick={handleCheer} variant="cheer">
            Cheer
          </ActionButton>
          <ActionButton onClick={handleReset} variant="reset">
            Reset
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export const PetCard = memo(PetCardComponent);

