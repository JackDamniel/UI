import React from 'react';

interface EditButtonProps {
    onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} type="button" className="btn btn-primary btn-sm me-2">
            Edit Task
        </button>
    );
}

export default EditButton;