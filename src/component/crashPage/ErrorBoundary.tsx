import * as React from "react";
import CrashPage from './CrashPage';
import notice from '../toast/index';
import {setError} from "./globalError";

type props={
	init:number;
};
type states = {
	preInit:number;
	hasError:boolean;
};
export default class ErrorBoundary extends React.Component<props,states>{
	static  getDerivedStateFromProps(nextProps:props,preState:states):Partial<states> | null {
		if(nextProps.init!==preState.preInit && preState.hasError){
			return {
				hasError:false,
				preInit:nextProps.init
			};
		}else{
			return null;
		}
	}
	static getDerivedStateFromError(_error:Error){
			setError(true);
			
			return {hasError:true} ;
	}

	state:states = {
		hasError:false,
		preInit:this.props.init
	};
	reload=()=>{
		this.setState({
			hasError:false
		},()=>{
			setError(false);
			notice.clear();
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