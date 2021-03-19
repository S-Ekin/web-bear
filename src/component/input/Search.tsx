/**
 * @name 搜索框
 * @description description
 * @time 2019-08-18
 */
import * as React from "react";
import { Animate } from "../animate/index";
import {SvgIcon } from "../my-icon/index";
import { Button } from "../button/index";

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
		tip: "查询结果...",
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
		const { tip ,width, children } = this.props;
		const styleObj = width ? {width}:undefined;
		const jBtn = children ? (
			<Button handle={this.toggleSearch}>
				{children}
			</Button>
		) : undefined;
		const searchIcon = children ? undefined : (
			<span className="j-search-icon" onClick={this.toggleSearch}>
				<SvgIcon className="search" />
			</span>
		);
		const right = children ? 0.5 : 1.6;
		return (
			<div className="g-search">
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
							style={{right: `${right}em`,}}
							onClick={this.closeSearch}>
							<SvgIcon className="close" />
						</span>
					</Animate>
					{ searchIcon }
				</div>
				{jBtn}
			</div>
		);
	}
}


export default Search;