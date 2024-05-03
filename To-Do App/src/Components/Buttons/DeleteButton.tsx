import React from 'react';

interface DeleteButtonProps {
    onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} type="button" className="btn btn-danger btn-sm me-2">
            Delete Task
        </button>
    );
}

export default DeleteButton;