import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Character } from '../../api/api/rick';
import CharacterCard from './CharacterCard'; 

interface CharacterListProps {
    characters: Character[]; 
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
    const [page, setPage] = useState<number>(1);
    const [allCharacters, setAllCharacters] = useState<Character[]>(characters);

    useEffect(() => {
        fetchCharacters();
    }, [page]);

    const fetchCharacters = async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
            setAllCharacters(prevCharacters => [...prevCharacters, ...response.data.results]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    };

    return (
        <InfiniteScroll
            dataLength={allCharacters.length}
            next={fetchCharacters}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more characters to load</p>}
        >
            <div className="character-list"> 
                {allCharacters.map(character => (
                    <CharacterCard key={character.id} character={character} />
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default CharacterList;