import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import SlideMenu from "./SlideMenu";
import Head from "./Head";
import MainRouter from "./Router";
import {setError} from "../component/crashPage/globalError";

type appProps = {
};
type toggleMenuFn = (expand?:boolean)=>boolean | undefined;
type appState = {
	menuExpand:boolean;
	init:number;	
};
class App extends React.PureComponent<appProps, appState>{
  toggleMenuFn:toggleMenuFn | undefined ;
	state :appState = {
		menuExpand:true,
		init:0
	};
	
	toggleMenuSlide=(expand?:boolean)=>{

		this.setState({
			menuExpand:!!expand,
		});

	}
	navCallBack=()=>{
		console.log(33);
		const hasError = setError();
		if(hasError){
			this.setState(pre=>{
				return {
					init:pre.init+1
				};
			},()=>{
				setError(false);
			});
		}
		
	}
	render() {
		const {menuExpand,init} = this.state;
		return (
      <BrowserRouter>
        <SlideMenu callback={this.navCallBack} expand={menuExpand} toggleMenuFn={this.toggleMenuSlide} />
        <div className="g-content">
          <Head expand={menuExpand} toggleMenuFn={this.toggleMenuSlide} />
          <MainRouter init={init} />
        </div>
      </BrowserRouter>
    );
	}

}

export default App;  