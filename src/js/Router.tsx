import { Route } from "react-router-dom";
import * as React from "react";
import Loading from "@js/common/Loading";
import * as loadable from "react-loadable";

class MainRouter extends React.PureComponent{
	render(){
		return (
			<>
					<Route path="/button" component={loadable({
						loader: () => import( /*webpackChunkName: "button" */"./common/button/Test"),
						loading: () => <Loading.LoadingCom />
					})} />
					<div id="s-modal"></div>
				</>
			);

	}
}

export default MainRouter ;