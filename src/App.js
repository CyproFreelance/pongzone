import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Home } from './containers/home';
import { Load } from './containers/loading';
import { Game } from './containers/game';
import { Result } from './containers/result';
import { Admin } from './components/admin';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/matchmaking' element={<Load/>}/>
          <Route path='/gameroom' element={<Game/>}/>
          <Route path='/result' element={<Result/>}/>
          <Route path='/straightouttacampaign-admin-space' element={<Admin/>}/>
          {/* You can change the password its just complex url anyways `userdeveloper` to something else if you want :) */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
