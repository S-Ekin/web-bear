
import * as React from "react";
import Loading from "@js/common/Loading";

// 用来保存异步加载的module,也就是路由组件

type BoundleProp = {
	asyncLoad:()=>PromiseLike<{}>;
}
class Boundle extends React.Component<BoundleProp>{

	state:{
		mod:any;
	} = {
		mod:null
	};

	load(){

		this.setState({
			mod:null,
		});
		this.props.asyncLoad().then(mod=>{

			console.log(mod,"mod")

				this.setState({
						mod:mod,
				});

		});
	}

	componentDidMount(){
			this.load();
	}

	componentWillReceiveProps(nextProps:any){

	 if(nextProps.asyncLoad !== this.props.asyncLoad) {
            this.load();
    }

	}

	render(){
		const child = this.props.children as Function ;
		return  child(this.state.mod) ;
	}


}




export default (callfn:BoundleProp["asyncLoad"])=>(props:React.Props<{}>)=>(


		<Boundle asyncLoad={callfn}>
			
			{
			  (Comp:any) => (Comp ? <Comp.default {...props} /> : <Loading.LoadingCom />)
			}

		</Boundle>

	);












