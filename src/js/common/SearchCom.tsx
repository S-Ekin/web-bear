import * as React from "react";
import { VelocityComponent } from "velocity-react";


type props = {
	searchHandle: (keyword: string,field?:string) => void;
	closeHandle?: (field?:string) => void;
	tip?: string;
	width?:number;
	hasBtn?:boolean;
	field?:string;
}

type state = {
	searching: boolean;
}

export default class SearchCom extends React.PureComponent<props, state>{

	static defaultProps = {
		tip: "查询搜索结果...",
		width:200,
		hasBtn:true,
	}
	state: state = {
		searching: false,
	}

	inpDom: React.RefObject<HTMLInputElement> = React.createRef();

	toggleSearch = () => {


		const keyWord = this.inpDom.current!.value.trim();
		if (!keyWord) {
			return;
		}
		const {field} = this.props;
		this.setState({
			searching: true,
		});

		this.props.searchHandle(keyWord,field);



	}

	componentWillReceiveProps(nextProps:props){

		if(nextProps.field!=this.props.field){

			// this.inpDom.current!.value = "";

			// this.setState({
			// 	searching:false
			// })
			this.closeSearch();

		}


	}

	closeSearch = () => {

		this.setState({
			searching: false,
		});
		this.inpDom.current!.value = "";

		const {closeHandle,field} = this.props;
		
		closeHandle && closeHandle(field);
	}

	keyPress=(e:React.KeyboardEvent)=>{

		if(e.key==="Enter"){

			this.toggleSearch();

		}
	}


	render() {

		const { searching } = this.state;
		const { tip ,width,hasBtn} = this.props;

		return (<div className="m-search">
			<span className="m-inp-val" style={{width}}>
				<input 
					type="text" 
					ref={this.inpDom} 
					className="s-inp" 
					placeholder={tip}
					onKeyDown={this.keyPress}
				/>
				<VelocityComponent animation={searching ? "fadeIn" : "fadeOut"}>
					<span className="m-search-close" onClick={this.closeSearch}><i className="fa fa-times fa-lg"></i></span>
				</VelocityComponent>
			</span>
			{hasBtn ? (<button className="s-btn normal-btn primary" onClick={this.toggleSearch}>
				<span className="fa fa-search"></span>
			</button>):null}
		</div>)
	}


}