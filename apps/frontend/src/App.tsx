import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './home';
import Devices from './devices';
import Images from './images';
import Workspace from './workspace';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/devices' element={<Devices />} />
        <Route path='/images' element={<Images />} />
        <Route path='/workspace' element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;