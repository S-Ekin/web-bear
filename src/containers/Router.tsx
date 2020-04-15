import { Route ,Switch} from "react-router-dom";
import * as React from "react";
import * as loadable from "react-loadable";
import ErrorBoundary from '@component/crashPage/ErrorBoundary';

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

class MainRouter extends React.PureComponent{
	static  getDerivedStateFromProps() {
			console.log('gh');
			
            return null ;
    }
	render(){
		return ( 
		
		<div className="g-main">
            <ErrorBoundary>
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