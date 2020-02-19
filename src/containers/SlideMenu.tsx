import * as React from "react";
import {NavMenu} from "@component/menu/index";
import * as Velocity from "velocity-react";
import { SvgIcon } from "@component/icon/index";

type slideMenu = {
	data: any[];
};

type SlideMenuProp = {
	expand:boolean;
 	toggleMenuFn:(expand?:boolean)=>void;
};
type SlideMenuState = {


};

const menuList = [
	{
		id: "10",
		name: "按钮类型",
		url: "/button",
		icon: "menu-button",
		children: [
			{
				id: "11",
				name: "普通按钮",
				url: "/button",
				icon: "",
				children: [],
			},
		],
	},
	{
		id: "20",
		name: "列表类型",
		url: "/table",
		icon: "table",
		children: [
			{
				id: "21",
				name: "表格",
				url: "/table",
				icon: "",
				children: [],
			},
		],
	},
	{
		id: "30",
		name: "日历",
		url: "/calenar",
		icon: "calendar",
		children: [
			{
				id: "31",
				name: "日历",
				url: "/calendar",
				icon: "",
				children: [],
			},
		],
	},
	{
		id: "40",
		name: "数据结构",
		url: "/dataType",
		icon: "dataType",
		children: [
			{
				id: "41",
				name: "二叉树",
				url: "/bintree",
				icon: "",
				children: [],
			},
		],
	},
] as any;

class SlideMenu extends React.PureComponent<SlideMenuProp , SlideMenuState>{

	state: slideMenu = {
		data:menuList,
	};

	menuIconHandle=()=>{
		const {toggleMenuFn} = this.props;
		toggleMenuFn(true);
	}
	slideMenu(){
	 
		const {expand} = this.props;
		const expandIcon = !expand ? (
						<span className="j-slideBar" onClick={this.menuIconHandle}>
							<SvgIcon className="menu-slide" size="big" />
						</span>
						):undefined;
			return expandIcon ;
	}

	render() {

		const { data } = this.state;
		const {expand} = this.props;
		return (
			<Velocity.VelocityComponent duration={300} animation={{ width: expand ? 250 : 70 }}>
				<div className={"g-slideMenu " + (!expand ? "expand" : "")}>
					<div className="g-logo shadow">
						<span className="m-logo" />
					{this.slideMenu()}
					</div>
					 <NavMenu data={data} expand={expand}   />
				</div>
			</Velocity.VelocityComponent>
			);
	}

}

export default SlideMenu;