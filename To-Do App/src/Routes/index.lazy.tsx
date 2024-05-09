import { createLazyFileRoute } from '@tanstack/react-router';
import teslaImage from '../Assets/nikola-tesla-mostra-trieste-.jpg'; 

export const Route = createLazyFileRoute('/')({
  component: Home,
});

export function Home() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-3">Hello World</h2>
      <div className="text-center">
        <img src={teslaImage} alt="Tesla" />
      </div>
    </div>
  );
}