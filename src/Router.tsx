import { Route } from "react-router-dom";
import * as React from "react";
import * as loadable from "react-loadable";

class MainRouter extends React.PureComponent{
	render(){
		return (
			<>
					<Route path="/button" component={loadable({
						loader: () => import( /*webpackChunkName: "button" */"./component/button/demo"),
						loading: () => <span>loading......</span>
					})} />
					<div id="s-modal"></div>
				</>
			);

	}
}

export default MainRouter ;