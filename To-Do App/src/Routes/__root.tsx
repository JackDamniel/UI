import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import '../index.css';

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar /> 
      <Outlet /> 
      <Footer /> 
    </>
  ),
});

