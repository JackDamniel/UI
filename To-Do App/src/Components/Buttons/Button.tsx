import React from 'react';

interface ButtonProps {
  type: 'edit' | 'delete' | 'completion';
  onClick: () => void;
  completed?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, completed }) => {
  let buttonClass = '';
  let buttonText = '';

  switch (type) {
    case 'edit':
      buttonClass = 'btn btn-primary me-2';
      buttonText = 'Edit';
      break;
    case 'delete':
      buttonClass = 'btn btn-danger me-2';
      buttonText = 'Delete';
      break;
    case 'completion':
      buttonClass = completed ? 'btn btn-success me-2' : 'btn btn-purple me-2';
      buttonText = completed ? 'Completed' : 'Mark Complete';
      break;
    default:
      throw new Error(`Invalid button type: ${type}`);
  }

  return (
    <button onClick={onClick} type="button" className={buttonClass}>
      {buttonText}
    </button>
  );
};

export default Button;