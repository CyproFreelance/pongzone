import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Home } from './containers/home';
import { Load } from './containers/loading';
import { Game } from './containers/game';
import { Result } from './containers/result';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/matchmaking' element={<Load/>}/>
          <Route path='/gameroom' element={<Game/>}/>
          <Route path='/result' element={<Result/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
