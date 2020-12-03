
import "./assets/tailwind/styles.css"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from 'scenes/login/Login';
import Main from './scenes/main/Main';
import Widget from './scenes/widget/Widget';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const isAuthenticated = Cookies.get('echat:token')

  return (
    <>
      <Router>
        <Switch>
          {!isAuthenticated &&
          <Route path="/">
            <Login />
          </Route>}
          {isAuthenticated &&
          <>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/widget">
            <Widget />
          </Route>
          </>}
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
