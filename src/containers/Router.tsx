import { Route } from "react-router-dom";
import * as React from "react";
import * as loadable from "react-loadable";

const routerConfig={
	button:{
		loader: () => import( /*webpackChunkName: "button" */"../component/button/demo/demo"),
		loading: () => <span>loading......</span>
	}
};

class MainRouter extends React.PureComponent{
	render(){
		return (
			<>
				<Route path="/button" component={loadable(routerConfig.button)} />
				<div id="s-modal"/>
			</>
			);

	}
}

export default MainRouter ;