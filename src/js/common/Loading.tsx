
import * as React from "react";
import {createPortal} from "react-dom";


type LoadingProp = {
		container:HTMLElement;
}


type LoadingState = {
	
}

class Loading extends React.PureComponent<LoadingProp,LoadingState>{

	
	static LoadingCom:React.SFC=()=>{

		return (<div className="g-loading">
								<div className="m-loading">
											<b className="loading-text">loading...</b>
								</div>
						</div>);
	}
	render(){

		const {container} = this.props;
		
		return  createPortal(<Loading.LoadingCom/>,container)  
	}

}

export default Loading ;