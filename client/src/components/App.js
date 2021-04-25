import '../styles/App.css';
import { Switch, Route} from 'react-router-dom';
import Modal from 'react-modal'

import Login from './Login'
import Main from './Main'
import ProtectedRoute from './ProtectedRoute'

//const token = localStorage.getItem('token');

Modal.setAppElement('#root');

function App() {
  return (
    <div className="app_main">
      {/* <Header /> */}
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute path="/" component={Main} />
        </Switch> 
    </div>
  );
}

export default App;
