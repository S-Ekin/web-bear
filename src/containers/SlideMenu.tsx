import * as React from "react";
import {NavMenu} from "@component/menu/index";
import * as Velocity from "velocity-react";
import { SvgIcon } from "@component/my-icon/index";
import {event} from "@component/util/Event";
import noticeFn from "@component/toast/index";
import {menuList} from "./menuData";
type SlideMenuProp = {
};
type SlideMenuState = {
	expand:boolean;
	data: any[];
};

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
    noticeFn.clear();
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