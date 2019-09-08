import * as React from "react";

export default class ErrorBoundary extends React.Component{

	static getDerivedStateFromError(error:any){

			console.log(error);
			return {hasError:true} ;

	}

	state = {hasError:false};
	componentDidCatch(error:any,info:any){

		console.log(error,info);

	}

	render(){

		if(this.state.hasError){
			return <div>组件出错！</div>;
		}else{
			return this.props.children ;
		}
	
	}


}