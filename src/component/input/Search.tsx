/**
 * @name 搜索框
 * @description description
 * @time 2019-08-18
 */
import * as React from "react";
import { Animate } from "../animate/index";
import {SvgIcon} from "../my-icon/index";

type props={
    searchHandle: (keyword: string,field:string) => void;
	closeHandle?: (field:string) => void;
	tip?: string;
	width?:number;
	field:string;
};
type states={
	searching: boolean;
	keyword:string;
	preField:string;
};
interface ISearch {
	closeSearch():void;
}
class Search extends React.PureComponent<props,states> implements ISearch{ 
	static defaultProps = {
		tip: "查询搜索结果...",
	};
	static  getDerivedStateFromProps(nextProps:props,preState:states):Partial<states> | null {
		if(nextProps.field!==preState.preField) {
			// 兼容一个搜索框用在两种类型的搜索

			const {closeHandle,field} = nextProps;
			if(closeHandle){
				closeHandle(field);
			}
			return {
            	searching: false,
				keyword:"",
				preField:nextProps.field
			};
		
		}else{
			return null ;
		}
	}
    state:states={
        searching:false,
		keyword:"",
		preField:this.props.field
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
				<Animate animation={searching ? "fadeIn" : "fadeOut"} spanWrapEle={true}>
					<span
						className="m-search-close"
						onClick={this.closeSearch}>
						<SvgIcon className="close" />
					</span>
				</Animate>
				<span className="j-search-icon" onClick={this.toggleSearch}>
					<SvgIcon className="search" />
				</span>
			</div>
		);
	}
}


export default Search;