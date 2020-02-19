import * as React from "react";
import {BrowserRouter,Switch} from "react-router-dom";
import SlideMenu from "./SlideMenu";
import Head from "./Head";
import MainRouter from "./Router";
type appProps = {

};

type appState = {
	menuExpand:boolean;
	
};
class App extends React.PureComponent<appProps, appState>{

	state :appState = {
		menuExpand:true
	};

	toggleMenuSlide=(expand?:boolean)=>{

		this.setState({
			menuExpand:!!expand,
		});

	}
	render() {
		const {menuExpand} = this.state;
		return (
			<BrowserRouter>
				<SlideMenu  expand={menuExpand} toggleMenuFn={this.toggleMenuSlide}/>
				<div className="g-content">
					<Head  expand={menuExpand} toggleMenuFn={this.toggleMenuSlide}/>
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