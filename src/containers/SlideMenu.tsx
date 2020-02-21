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
        url: "/button/common",
        icon: "",
        children: []
      },
      {
        id: "12",
        name: "美化按钮",
        url: "/button/input",
        icon: "",
        children: []
	  },
	  {
        id: "13",
        name: "动画按钮",
        url: "/button/animate",
        icon: "",
        children: []
      }
    ]
  },
  {
    id: "20",
    name: "列表类型",
    url: "/table",
    icon: "table",
    children: [
      {
        id: "21",
        name: "普通表格",
        url: "/table/list",
        icon: "",
        children: []
	  },
	  {
		id: "22",
        name: "树形表格",
        url: "/table/tree",
        icon: "",
        children: []
	  },
	  {
		id: "23",
        name: "固定表格",
        url: "/table/frozen",
        icon: "",
        children: []
	  },
    ]
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
        children: []
      }
    ]
  },
  {
    id: "50",
    name: "数据加载",
    url: "/loading",
    icon: "loading",
    children: [
      {
        id: "51",
        name: "加载中",
        url: "/loading/index",
        icon: "",
        children: []
      },
      {
        id: "52",
        name: "页面崩溃",
        url: "/loading/crash",
        icon: "",
        children: []
      },
      {
        id: "53",
        name: "空数据与图标",
        url: "/loading/empty",
        icon: "",
        children: []
	  },
    ]
  },
  {
    id: "60",
    name: "下拉框",
    url: "/combo",
    icon: "combo",
    children: [
      {
        id: "61",
        name: "列表下拉框",
        url: "/combo/list",
        icon: "",
        children: []
	  },
	    {
        id: "62",
        name: "树形下拉框",
        url: "/combo/tree",
        icon: "",
        children: []
	  } ,
	  {
        id: "63",
        name: "日历",
        url: "/combo/calendar",
        icon: "",
        children: []
      }
    ]
  },
  {
    id: "70",
    name: "模态框",
    url: "/modal",
    icon: "alert",
    children: [
      {
        id: "71",
        name: "一般模态框",
        url: "/combo/list",
        icon: "",
        children: []
	  },
	    {
        id: "72",
        name: "提示框",
        url: "/combo/toast",
        icon: "",
        children: []
      }
    ]
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