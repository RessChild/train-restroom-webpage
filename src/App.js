
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { defaultFrameRoutePath, frameRoute } from "./router";

const App = () => {
  
  const createRouter = () => {
    return <Switch>
      { frameRoute.map( route => <Route key={`app-router-${route.key}`} {...route} /> ) }
      <Redirect to={defaultFrameRoutePath} />
    </Switch>
  }

  return (
    <BrowserRouter>
      { createRouter() }
    </BrowserRouter>
  );
}

export default App;
