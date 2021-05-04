
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { frameRouter } from "./router";

const App = () => {
  
  const createRoute = () => {
    return frameRouter.map( route => <Route {...route} />);
  }

  return (
    <BrowserRouter>
      <Switch>
      { createRoute() }
      </Switch>
    </BrowserRouter>
  );
}

export default App;
