import styled from 'styled-components';

type ButtonVariant = 'feed' | 'levelup' | 'cheer' | 'reset';

interface ActionButtonProps {
  variant: ButtonVariant;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'feed':
      return {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        hoverBackground: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      };
    case 'levelup':
      return {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        hoverBackground: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      };
    case 'cheer':
      return {
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        hoverBackground: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
      };
    case 'reset':
      return {
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        hoverBackground: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
      };
    default:
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        hoverBackground: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      };
  }
};

export const ActionButton = styled.button<ActionButtonProps>`
  flex: 1;
  min-width: 80px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  ${({ variant }) => {
    const styles = getVariantStyles(variant);
    return `
      background: ${styles.background};
      &:hover {
        background: ${styles.hoverBackground};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      &:active {
        transform: translateY(0);
      }
    `;
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

