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
				/*webpackChunkName: "loading" */ "./Router/ComboRouter"
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
	modal: {
		loader: () =>
			import(
				/*webpackChunkName: "modal" */ "./Router/ModalRoute"
			),
		loading: () => <span>loading......</span>,
	},
};
type props={

};
type state = {
	initRouter:boolean;
	hasError:boolean;
};
class MainRouter extends React.PureComponent<props,state>{
	state:state ={
		initRouter:false,
		hasError:false,
	};
	getHasErrorFn:(()=>boolean) | undefined;
	componentDidMount(){
		event.on("menuClick",(_status:boolean)=>{
			const hasError = this.getHasErrorFn && this.getHasErrorFn() ? true : false;
			if(hasError){
				this.setState(pre=>{
					return {
						initRouter:!pre.initRouter
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
					<Route path="/alert" component={loadable(routerConfig.modal)} />
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