import * as React from "react";
import {BrowserRouter,Switch} from "react-router-dom";
import SlideMenu from "./containers/SlideMenu";
import Head from "./containers/Head";
import MainRouter from "./Router";
type appProps = {

};

type appState = {
};
class App extends React.PureComponent<appProps, appState>{

	
	render() {
		return (
			<BrowserRouter>
				<SlideMenu  />
				<div className="g-content">
					<Head  />
					<div className="g-main">
						<Switch>

							<MainRouter />
						</Switch>
							
					</div>
				</div>
			</BrowserRouter>
		);
	}

}

export default App; 