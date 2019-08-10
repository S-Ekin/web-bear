import * as React from "react";
import {MemoryRouter,Switch} from "react-router-dom";
import SlideMenu from "@js/containers/SlideMenu";
import Head from "@js/containers/Head";
import MainRouter from "@js/Router";

type appProps = {

}

window.sys_defaultTime = {
	time:"",
	rotate:4
}; //所有的日历默认的时间;

type appState = {
}
class App extends React.PureComponent<appProps, appState>{

	
	render() {
		return (
			<MemoryRouter>
				<SlideMenu  />
				<div className="g-content">
					<Head  />
					<div className="g-main">
						<Switch>

							<MainRouter />
						</Switch>
							
					</div>
				</div>
			</MemoryRouter>
		)
	}

}




export default App; 