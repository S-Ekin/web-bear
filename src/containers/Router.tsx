import { Route ,Switch} from "react-router-dom";
import * as React from "react";
import * as loadable from "react-loadable";
import ErrorBoundary from '@component/crashPage/ErrorBoundary';
import {event} from "@component/util/Event";
import notice from "@component/toast/index";

const routerConfig = {
	buttonRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "buttonRouter" */ "./Router/ButtonRoute"
			),
		loading: () => <span>loading......</span>,
	},
	tableRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "table" */ "./Router/TableRouter"
			),
		loading: () => <span>loading......</span>,
	},
	
	loadingRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "loading" */ "./Router/LoadingRouter"
			),
		loading: () => <span>loading......</span>,
	},
	comboRouter: {
		loader: () =>
			import(
				/*webpackChunkName: "combo" */ "./Router/ComboRouter"
			),
		loading: () => <span>loading......</span>,
	},
	blog: {
		loader: () =>
			import(
				/*webpackChunkName: "blog" */ "./Router/BlogRoute"
			),
		loading: () => <span>loading......</span>,
	},
	problem: {
		loader: () =>
			import(
				/*webpackChunkName: "problem" */ "./Router/ProblemRoute"
			),
		loading: () => <span>loading......</span>,
	},
	modal: {
		loader: () =>
			import(
				/*webpackChunkName: "modal" */ "./Router/ModalRoute"
			),
		loading: () => <span>loading......</span>,
	},
	menu: {
		loader: () =>
			import(
				/*webpackChunkName: "menu" */ "./Router/MenuRouter"
			),
		loading: () => <span>loading......</span>,
	},
	scroll: {
		loader: () =>
			import(
				/*webpackChunkName: "scroll" */ "./Router/ScrollRouter"
			),
		loading: () => <span>loading......</span>,
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
					<Route path="/scroll" component={loadable(routerConfig.scroll)} />
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