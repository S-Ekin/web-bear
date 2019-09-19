/**
 * @name 搜索框
 * @description description
 * @time 2019-08-18
 */
import * as React from "react";
import { VelocityComponent } from "velocity-react";
import {Icon} from "../icon/index";

type props={
    searchHandle: (keyword: string,field?:string) => void;
	closeHandle?: (field?:string) => void;
	tip?: string;
	width?:number;
	field:string;
};
type states={
	searching: boolean;
    keyword:string;
};
interface ISearch {
	closeSearch():void;
}
class Search extends React.PureComponent<props,states> implements ISearch{
    
    static defaultProps = {
		tip: "查询搜索结果...",
	};

    state:states={
        searching:false,
        keyword:"",
    };
    toggleSearch = () => {

        const {keyword} = this.state;
		if (!keyword) {
			return;
		}
		const {field,searchHandle} = this.props;
		this.setState({
			searching: true,
		});

		searchHandle(keyword,field);

	}

	componentWillReceiveProps(nextProps:props){
		if(nextProps.field!==this.props.field){
			this.closeSearch();
		}
	}

	closeSearch = () => {

		this.setState({
            searching: false,
            keyword:"",
		});
        const {closeHandle,field} = this.props;
        if(closeHandle){
            closeHandle(field);
        }
	}

	keyPress=(e:React.KeyboardEvent)=>{

		if(e.key==="Enter"){

			this.toggleSearch();

		}
    }
    changeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget!;
        const value = dom.value.trim();

        this.setState({
            keyword:value,
        });
    }
   render() {

		const { searching , keyword } = this.state;
		const { tip ,width} = this.props;
		const styleObj = width ? {width}:undefined;

		return (
			<div className="m-search" style={styleObj}>
				<input
					type="text"
					className="s-inp"
					value={keyword}
					placeholder={tip}
					onChange={this.changeFn}
					onKeyDown={this.keyPress}
				/>
				<VelocityComponent animation={searching ? "fadeIn" : "fadeOut"}>
					<span
						className="m-search-close"
						onClick={this.closeSearch}>
						<Icon className="fa-times " />
					</span>
				</VelocityComponent>
				<span className="j-search-icon" onClick={this.toggleSearch}>
					<Icon className="fa-search" />
				</span>
			</div>
		);
	}
}


export default Search;