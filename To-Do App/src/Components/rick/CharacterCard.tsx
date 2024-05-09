import React from 'react';
import { Character } from '../../api/api/rick';
import '../../index.css'; 

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="card mb-3 character-card">
      <img src={character.image} className="card-img-top" alt={character.name} />
      <div className="card-body">
        <h5 className="card-title">{character.name}</h5>
        <p className="card-text">Status: {character.status}</p>
        <p className="card-text">Species: {character.species}</p>
        <p className="card-text">Gender: {character.gender}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
