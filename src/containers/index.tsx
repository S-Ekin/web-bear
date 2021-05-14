import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import SlideMenu from "./SlideMenu";
import Head from "./Head";
import MainRouter from "./Router";

type appProps = {

};
type toggleMenuFn = (expand?: boolean) => boolean | undefined;
type appState = {
};
class App extends React.PureComponent<appProps, appState> {
  toggleMenuFn: toggleMenuFn | undefined;
  state: appState = {
  };

  render () {
    return (
      <BrowserRouter>
        <SlideMenu />
        <div className="g-content">
          <div className="g-wrap-content">
            <Head />
            <MainRouter />
          </div>

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
