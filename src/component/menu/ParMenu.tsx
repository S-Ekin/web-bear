/**
 * @name 父菜单
 * @description description
 * @time 2019-08-14
 */
import * as React from "react";
import {SvgIcon } from "../my-icon/index";
import * as Immutable from "immutable";
import {NavLink} from "react-router-dom";
import {IMenuData, IfieldObj, Inode} from "./menu";
import { SlideBox } from "../animate/index";
import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";

type props = {
  node:IImmutalbeMap<Inode>;
  expand:boolean;
  fieldObj:IfieldObj;
  parIndex:number;
  toggleSlide:(index:number)=>void;
  changeData(
    callback:(data:IImmutalbeList<IImmutalbeMap<Inode>>, selected:string)=>{
      data:IImmutalbeList<IImmutalbeMap<Inode>>,
      selected:string
    }
  ):void;
};
type states = {
};

interface IParMenu {
  subMenu(children:Immutable.List<IImmutalbeMap<IMenuData>>, parIndex:number):Immutable.List<JSX.Element>;
  getSubCom():JSX.Element;
}
class ParMenu extends React.PureComponent<props, states> implements IParMenu {
  state: states = {
  };
  selectItemFn=(e:React.MouseEvent<HTMLSpanElement>) => {

    const dom = e.currentTarget!;
    const index = dom.dataset.index!;
    // 子节点的数据索引
    const indexArr = index.split(",");
    const {changeData} = this.props;

    changeData(function (_data:IImmutalbeList<IImmutalbeMap<Inode>>, selected:string) {

      const oldSelectedArr = selected.split(",");

      let data = _data;
      // 清除之前选中的字节点和父节点
      if (oldSelectedArr.length === 2) {
				 data = data.updateIn([oldSelectedArr[0]], (node:Inode) => node.set("selected", false).updateIn(["children", oldSelectedArr[1]], (item:Inode) => item.set("selected", false)));
      }

			 data = data.updateIn([indexArr[0]], (node:Inode) => node.set("selected", true).updateIn(["children", indexArr[1]], (item:Inode) => item.set("selected", true)));

      return {
        data,
        selected: index
      };

    });


  }
  subMenu (children:Immutable.List<IImmutalbeMap<IMenuData>>, parIndex:number) {
    const {fieldObj} = this.props;
    const idField = fieldObj.get("id");
    const textField = fieldObj.get("text");
    const urlField = fieldObj.get("url");
    return children.map((node, index) => {

      const id = node.get(idField);
      const text = node.get(textField);
      const activeName = node.get("selected") ? "active" : "";
      const url = node.get(urlField);
      const typeId = node.get("type") as string || "";
      const pathObj = {
        pathname: url,
        state: {
          typeId: `${typeId}`,
          text,
        }
      };

      return (
        <li className="li-child" key={id}>
          <div className={`menu-item menu-child ${activeName}`}>
            <span
              className="j-nav"
              data-index={`${parIndex},${index}`}
              onClick={this.selectItemFn}>
              <NavLink to={pathObj} replace>
                {text}
              </NavLink>
            </span>
          </div>
        </li>
      );
    });
  }
  getSubCom () {
    const { node, expand, parIndex} = this.props;

    const child = node.get("children");
    const subCom = (
      <ul className="child-ul">
        {this.subMenu(child, parIndex)}
      </ul>
    );
    return expand ? (
      <SlideBox slide={node.get("drop")} isImmedia>
        {subCom}
      </SlideBox>
    ) : subCom;
  }

  toggleSlide=() => {
    this.props.toggleSlide(this.props.parIndex);
  }

  render () {
    const { node, fieldObj, expand} = this.props;
    const  drop  = node.get("drop");


    const activeName = node.get("selected") ? "active" : "";
    const icon = node.get(fieldObj.get("icon"));
    const text = node.get(fieldObj.get("text"));

    const sub = this.getSubCom();


    return (
      <li className="li-par" >
        <div
          className={`menu-item menu-par ${activeName}`}
          onClick={expand ? this.toggleSlide : undefined}
        >
          <span className="par-icon">
            <SvgIcon className={icon} />
          </span>
          <span className="nav-text">{text}</span>
          <span className="m-slide-icon">
            <SvgIcon className={`arrow-${drop ? "down" : "right"}`} />
          </span>
        </div>
        {sub}
      </li>
    );
  }
}

export default ParMenu;
