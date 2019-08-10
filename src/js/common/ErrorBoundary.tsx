import * as React from "react";



export default class ErrorBoundary extends React.Component{
	state = {hasError:false};

	static getDerivedStateFromError(error:any){

			console.log(error);
			return {hasError:true} ;

	}

	componentDidCatch(error:any,info:any){

		console.log(error,info);

	}

	render(){

		if(this.state.hasError){
			return <div>组件出错！</div>
		}else{
			return this.props.children ;
		}
	
	}


}