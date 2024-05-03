import React from 'react';

interface CompletionButtonProps {
    onClick: () => void;
    completed: boolean;
}

const CompletionButton: React.FC<CompletionButtonProps> = ({ onClick, completed }) => {
    return (
        <button onClick={onClick} type="button" className={`btn btn-success btn-sm me-2 ${completed ? 'completed' : ''}`}>
            Mark as Completed
        </button>
    );
}

export default CompletionButton;