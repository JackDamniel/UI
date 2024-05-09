
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import fetchData from '../api/api/rick';
import CharacterList from '../Components/rick/CharacterList';

export const Route = createLazyFileRoute("/rick")({
  component: Tasks,
});

function Tasks() {
  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters"], 
    queryFn: fetchData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {characters ? (
          <CharacterList characters={characters} /> 
        ) : (
          <div>No items found</div>
        )}
      </ul>
    </div>
  );
}

export default Tasks;