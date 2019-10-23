import { Route } from "react-router-dom";
import * as React from "react";
import * as loadable from "react-loadable";

const routerConfig = {
	button: {
		loader: () =>
			import(
				/*webpackChunkName: "button" */ "../component/button/demo/Demo"
			),
		loading: () => <span>loading......</span>,
	},
	table: {
		loader: () =>
			import(
				/*webpackChunkName: "table" */ "../component/table/demo/Demo"
			),
		loading: () => <span>loading......</span>,
	},
	calendar: {
		loader: () =>
			import(
				/*webpackChunkName: "calendar" */ "../component/calendar/demo/Demo"
			),
		loading: () => <span>loading......</span>,
	},
	bintree: {
		loader: () =>
			import(
				/*webpackChunkName: "bintree" */ "../blog/bintree/Demo"
			),
		loading: () => <span>loading......</span>,
	},
};

class MainRouter extends React.PureComponent{
	render(){
		return (
			<>
				<Route path="/button" component={loadable(routerConfig.button)} />
				<Route path="/table" component={loadable(routerConfig.table)} />
				<Route path="/calendar" component={loadable(routerConfig.calendar)} />
				<Route path="/bintree" component={loadable(routerConfig.bintree)} />
				<div id="s-modal"/>
			</>
			);

	}
}

export default MainRouter ;