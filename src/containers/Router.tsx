import { Route ,Switch} from "react-router-dom";
import * as React from "react";
import ErrorBoundary from '@component/crashPage/ErrorBoundary';
import {event} from "@component/util/Event";
import notice from "@component/toast/index";
import loadable from "@component/util/routerLoad";
const routerConfig = {
	buttonRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "buttonRouter" */ "./Router/ButtonRoute"
			),
	},
	tableRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "table" */ "./Router/TableRouter"
			),
	},
	
	loadingRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "loading" */ "./Router/LoadingRouter"
			),
	},
	comboRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "combo" */ "./Router/ComboRouter"
			),
	},
	blog: {
		loader: () =>
			import(
				/*webpackChunkName: "blog" */ "./Router/BlogRoute"
			),
	},
	problem: {
		loader: () =>
			import(
				/*webpackChunkName: "problem" */ "./Router/ProblemRoute"
			),
	},
	modal: {
		loader: () =>
			import(
				/*webpackChunkName: "modal" */ "./Router/ModalRoute"
			),
	},
	menu: {
		loader: () =>
			import(
				/*webpackChunkName: "menu" */ "./Router/MenuRouter"
			),
	},
	util: {
		loader: () =>
			import(
				/*webpackChunkName: "util" */ "./Router/UtilRouter"
			),
	},
	animate: {
		loader: () =>
			import(
				/*webpackChunkName: "animate" */ "./Router/AnimateRoute"
			),
	},
};

type props={

};
type state = {
	initRouter:{init:boolean};
};
class MainRouter extends React.PureComponent<props,state>{
	state:state ={
		initRouter:{init:false},
	};
	getHasErrorFn:(()=>boolean) | undefined;
	componentDidMount(){
		event.on("menuClick",(status:boolean)=>{
			const hasError = this.getHasErrorFn && this.getHasErrorFn() ? true : false;
			if(hasError){
				this.setState(()=>{
					return {
						initRouter:{init:status}
					};
				},()=>{
					notice.clear();
				});
			}
				
		});
	}
	componentWillUnmount(){
		event.remove("menuClick");
	}
	bindGetHasError=(getHasErrorFn:(()=>boolean))=>{
		this.getHasErrorFn = getHasErrorFn;
	}
	
	render(){
		const {initRouter} = this.state;
		return ( 
		
		<div className="g-main">
            <ErrorBoundary init={initRouter} bindGetHasError={this.bindGetHasError}>
               <Switch>
					<Route path="/button" component={loadable(routerConfig.buttonRouter)} />
					<Route path="/table" component={loadable(routerConfig.tableRouter)} />
					<Route path="/loading" component={loadable(routerConfig.loadingRouter)} />
					<Route path="/combo" component={loadable(routerConfig.comboRouter)} />
					<Route path="/blog" component={loadable(routerConfig.blog)} />
					<Route path="/problem" component={loadable(routerConfig.problem)} />
					<Route path="/alert" component={loadable(routerConfig.modal)} />
					<Route path="/menu" component={loadable(routerConfig.menu)} />
					<Route path="/util" component={loadable(routerConfig.util)} />
					<Route path="/animate" component={loadable(routerConfig.animate)} />
              </Switch>
            </ErrorBoundary>
			<div id="inner-modal-wrap"/>
			<div id="wrap-loading" />
			<div id="wrap-notice" />
		</div>
		
			);

	}
}

export default MainRouter ;