import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import SlideMenu from "./SlideMenu";
import Head from "./Head";
import MainRouter from "./Router";
type appProps = {
};
type toggleMenuFn = (expand?:boolean)=>boolean | undefined;
type appState = {
	menuExpand:boolean;
	
};

class App extends React.PureComponent<appProps, appState>{
  toggleMenuFn:toggleMenuFn | undefined ;
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
        <SlideMenu expand={menuExpand} toggleMenuFn={this.toggleMenuSlide} />
        <div className="g-content">
          <Head expand={menuExpand} toggleMenuFn={this.toggleMenuSlide} />
          <MainRouter />
        </div>
      </BrowserRouter>
    );
	}

}

export default App;  