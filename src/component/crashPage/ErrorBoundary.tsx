import * as React from "react";
import CrashPage from './CrashPage';
import notice from '../toast/index';
import {event} from "../util/Event";
type props={
};
type states = {
	hasError:boolean;
};
export default class ErrorBoundary extends React.Component<props,states>{
	static getDerivedStateFromError(error:any){
			console.log(error);
			return {hasError:true} ;
	}
	state:states = {
		hasError:false,
	};
	reload=()=>{
		this.setState({
			hasError:false
		},()=>{
			notice.clear();
		});
	}
	componentDidMount(){
		event.on("menuClick",(status:boolean)=>{
			const {hasError} = this.state;
			if(hasError){
				this.setState({
					hasError:status,
				},()=>{
					notice.clear();
				});
			}else{
				notice.clear();
			}
			
		});
	}
	componentDidCatch(_error:any,_info:any){
		notice.add("数据操作出错，点击按钮重新加载页面！","warn",true);
	}
	componentWillUnmount(){
		event.remove("menuClick");
	}
	render(){

		if(this.state.hasError){
			return <CrashPage reloadFn={this.reload}/>;
		}else{
			return this.props.children ;
		}
	}
}