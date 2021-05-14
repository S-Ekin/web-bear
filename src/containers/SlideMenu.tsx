import * as React from "react";
import {NavMenu} from "@component/menu/index";
import { SvgIcon } from "@component/my-icon/index";
import {event} from "@component/util/Event";
import noticeFn from "@component/toast/index";
import {menuList} from "./menuData";
import { IMenuData } from "@component/menu/menu";
type SlideMenuProp = {
};
type SlideMenuState = {
  expand:boolean;
  data: IMenuData[];
};

class SlideMenu extends React.PureComponent<SlideMenuProp, SlideMenuState> {
  state: SlideMenuState = {
    data: menuList as IMenuData[],
    expand: true,
  };
  toggleMenuIcon () {
    this.setState((pre) => ({
      expand: !pre.expand,
    }));
  }
  menuIconHandle = () => {
    this.toggleMenuIcon();
    event.emit("expandIcon");
  };
  slideMenu () {
    const { expand } = this.state;
    const expandIcon = !expand ? (
      <span className="j-slideBar" onClick={this.menuIconHandle}>
        <SvgIcon className="menu-slide" size="big" />
      </span>
    ) : undefined;
    return expandIcon;
  }
  clickCallBack = () => {
    event.emit("menuClick", false);
    noticeFn.clear();
  }
  componentDidMount () {
    event.on("menuExpand", () => {
      this.toggleMenuIcon();
    });
  }
  componentWillUnmount () {
    event.remove("menuExpand");
  }

  render () {
    const { data, expand } = this.state;
    return (
      <NavMenu data={data} expand={expand} clickBack={this.clickCallBack}>
        <div className="g-logo shadow">
          <span className="m-logo" />
          {this.slideMenu()}
        </div>
      </NavMenu>
    );
  }
}

export default SlideMenu;
