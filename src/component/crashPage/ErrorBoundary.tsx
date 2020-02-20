import * as React from "react";
import CrashPage from './CrashPage';
import notice from '../toast/index';
export default class ErrorBoundary extends React.Component{

	static getDerivedStateFromError(error:any){

			console.log(error);
			return {hasError:true} ;

	}

	state = {hasError:false};
	reload=()=>{
		this.setState({
			hasError:false
		});
	}
	componentDidCatch(_error:any,_info:any){
		notice.add("数据操作出错，点击按钮重新加载页面！","warn",true);
	}
	render(){

		if(this.state.hasError){
			return <CrashPage reloadFn={this.reload}/>;
		}else{
			return this.props.children ;
		}
	}
}