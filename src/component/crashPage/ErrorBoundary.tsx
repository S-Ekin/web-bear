import * as React from "react";
import CrashPage from './CrashPage';
import notice from '../toast/index';
type props={
	init:{init:boolean};
	bindGetHasError?:(getHasErrorFn:()=>boolean)=>void;
};
type states = {
	hasError:boolean;
	preInit:{init:boolean};
};
export default class ErrorBoundary extends React.Component<props,states>{
	static  getDerivedStateFromProps(nextProps:props,preState:states):Partial<states> | null {
		const newInit = nextProps.init;
		if(newInit!==preState.preInit){
			return {
				hasError:newInit.init,
				preInit:nextProps.init
			};
		}else{
			return null ;
		}
	}
	static getDerivedStateFromError(_error:any){
			return {hasError:true} ;
	}

	state:states = {
		hasError:false,
		preInit:this.props.init
	};	
	constructor(props:props){
		super(props);
		const {bindGetHasError} = props;
		if(bindGetHasError){
			bindGetHasError(this.getHasError);
		}
	}
	getHasError=()=>{
		return this.state.hasError;
	}
	reload=()=>{
		this.setState(()=>{
			return {
				hasError:false
			};
		},()=>{
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