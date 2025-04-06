import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './home';
import Devices from './devices';
import Images from './images';
import WorkspaceDetail from './workspace';
import DeviceDetail from './devices/detail';
import ImageDetail from './images/detail';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/devices' element={<Devices />} />
          <Route path='/devices/:id' element={<DeviceDetail />} />
          <Route path='/images' element={<Images />} />
          <Route path='/images/:id' element={<ImageDetail />} />
          <Route path='/workspace' element={<WorkspaceDetail />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;