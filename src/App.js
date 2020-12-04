
import "./assets/tailwind/styles.css"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from 'scenes/login/Login';
import Register from 'scenes/register/Register';
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
          <>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/widget">
              <Widget />
            </Route>
          </>}
          {isAuthenticated &&
          <>
          <Route exact path="/">
            <Main />
          </Route>
          </>}
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
