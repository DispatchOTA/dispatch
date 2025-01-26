import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './home';
import Devices from './devices';
import Images from './images';
import Workspace from './workspace';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/devices' element={<Devices />} />
          <Route path='/images' element={<Images />} />
          <Route path='/workspace' element={<Workspace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;