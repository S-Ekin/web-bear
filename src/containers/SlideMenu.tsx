import * as React from "react";
import {NavMenu} from "@component/menu/index";
import * as Velocity from "velocity-react";
import { SvgIcon } from "@component/my-icon/index";
import {event} from "@component/util/Event";

type SlideMenuProp = {
};
type SlideMenuState = {
	expand:boolean;
	data: any[];
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
        name: "页面布局",
        url: "/button/layout",
        icon: "",
        children: []
	  },
	  {
        id: "13",
        name: "输入框类型",
        url: "/button/input",
        icon: "",
        children: []
      },
      {
        id: "14",
        name: "复选框",
        url: "/button/checkbox",
        icon: "",
        children: []
	  },{
        id: "15",
        name: "搜索",
        url: "/button/search",
        icon: "",
        children: []
	  },
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
        url: "/blog/bintree",
        icon: "",
        children: []
      },
      {
        id: "42",
        name: "自由树",
        url: "/blog/tree",
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
        url: "/alert/modal",
        icon: "",
        children: []
	  },
	    {
        id: "72",
        name: "提示框",
        url: "/alert/toast",
        icon: "",
        children: []
      }
    ]
  },
] as any;

class SlideMenu extends React.PureComponent<SlideMenuProp , SlideMenuState>{

	state: SlideMenuState = {
    data:menuList,
    expand:true
  };
  toggleMenuIcon(){
    this.setState(pre=>{
      return {
        expand:!pre.expand,
      };
    });
  }
	menuIconHandle=()=>{
    this.toggleMenuIcon();
    event.emit('expandIcon');
	}
	slideMenu(){
	 
		const {expand} = this.state;
		const expandIcon = !expand ? (
						<span className="j-slideBar" onClick={this.menuIconHandle}>
							<SvgIcon className="menu-slide" size="big" />
						</span>
						):undefined;
			return expandIcon ;
  }
  clickCallBack(){
    event.emit("menuClick",false);
  }
  componentDidMount(){
    event.on("menuExpand",()=>{
        this.toggleMenuIcon();
    });
  }
  componentWillUnmount(){
    event.remove("menuExpand");
  }

	render() {
		const { data ,expand} = this.state;
		return (
			<Velocity.VelocityComponent duration={300} animation={{ width: expand ? 250 : 70 }}>
				<div className={"g-slideMenu " + (!expand ? "expand" : "")}>
					<div className="g-logo shadow">
						<span className="m-logo" />
					{this.slideMenu()}
					</div>
					 <NavMenu data={data} expand={expand} clickBack={this.clickCallBack}  />
				</div>
			</Velocity.VelocityComponent>
			);
	}

}

export default SlideMenu;