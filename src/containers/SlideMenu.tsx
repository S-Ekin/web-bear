import * as React from "react";
import {NavMenu} from "@component/menu/index";
import * as Velocity from "velocity-react";
import { SvgIcon } from "@component/icon/index";

type slideMenu = {
	data: any[];
};

type SlideMenuProp = {
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
] as any;

class SlideMenu extends React.PureComponent<SlideMenuProp , SlideMenuState>{

	state: slideMenu = {
		data:menuList,
	};

	render() {

		const { data } = this.state;
		const expand = true;
		const expandIcon = !expand ? (
						<span className="j-slideBar" onClick={undefined}>
							<SvgIcon className="menu-shrink" size="big" />
						</span>
						):undefined;
		return (
			<Velocity.VelocityComponent duration={300} animation={{ width: expand ? 250 : 70 }}>
				<div className={"g-slideMenu " + (!expand ? "expand" : "")}>
					<div className="g-logo shadow">
						<span className="m-logo" />
					{expandIcon}
					</div>
					 <NavMenu data={data} expand={expand}   />
				</div>
			</Velocity.VelocityComponent>
			);
	}

}

export default SlideMenu;