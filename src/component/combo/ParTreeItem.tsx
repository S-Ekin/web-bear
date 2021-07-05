/**
 * @name 树形下拉框的目录组件
 * @description description
 * @time 2019-08-17
 */
import * as React from "react";
import { SvgIcon } from "../my-icon/index";
import * as Immutable from "immutable";
import {activeStatus, DropItem} from "./DropItem";
import { SlideBox } from "../animate/index";
import {CheckBox} from "../input/index";
import {Idrop, Inode} from "./combo";
import {IImmutalbeMap} from "../util/immutableUtil";

type immutableData<T> = Immutable.List<IImmutalbeMap<Inode & T>>;

type props<T> = {
  node: IImmutalbeMap<Inode & T>;
  fieldObj: Idrop<"tree", T>["filedObj"];
  index: string;// 节点索引
  lev: number// 树形节点的层级
  formatterDropItem?: (node: IImmutalbeMap<Inode & T>) => React.ReactNode;
  checkMethod(value:string):void;
  checkForPar(value:string):void;
  clickFn(index:string):void;
  toggleExpand(index:string):void;
};

type states={

};
interface IParTreeItem {
  toggleExpandFn(e:React.MouseEvent<HTMLDivElement>):void;
}
class ParTreeItem<T extends AnyObj> extends React.PureComponent<props<T>, states> implements IParTreeItem {

  static defaultProps={
    childField: "children",
  };
  state:states={

  };


  checkFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget!;
    const value = dom.value!;
    this.props.checkForPar(value);
  }
  getCheckbox (text:string, expand:boolean) {
    const {fieldObj, node, index} = this.props;
    const multiply = fieldObj.get("multiply");
    const active = node.get("active");
    const hasChecked = activeStatus.hasSelect === active;
    const checked = activeStatus.select === active;
    const icon = <SvgIcon className={expand ? "folder-open" : "folder"}/>;
    return multiply ? (
      <CheckBox
        hasChecked={hasChecked}
        checked={checked}
        value={index}
        type="checkbox"
        changeHandle={this.checkFn}
      >
        {icon}
        <span className="combo-text">{text}</span>
      </CheckBox>
    ) : (
      <>
        {icon}
        <span className="combo-text">{text}</span>
      </>
    );
  }

  getSubCom (childArr:immutableData<T>, lev:number, oindex:string) {
    const {fieldObj, clickFn, checkForPar, checkMethod, toggleExpand, formatterDropItem} = this.props;
    const idField = fieldObj.get("idField");
    const multiply = fieldObj.get("multiply");
    return childArr.map((val:IImmutalbeMap<Inode & T>, index:number) => {

      const child = val.get(fieldObj.get("childField")!) as immutableData<T>;

      return !child.size ? (
        <DropItem
          key={val.get(idField)}
          node={val}
          fieldObj={fieldObj}
          index={`${oindex},${index}`}
          lev={lev + 1}
          clickFn={clickFn}
          formatterDropItem={formatterDropItem}
          checkMethod={checkMethod}
          CheckBox={multiply ? CheckBox : undefined}
        />
      ) : (
        <ParTreeItem
          key={val.get(idField)}
          node={val}
          fieldObj={fieldObj}
          clickFn={clickFn}
          index={`${oindex},${index}`}
          lev={lev + 1}
          checkForPar={checkForPar}
          formatterDropItem={formatterDropItem}
          checkMethod={checkMethod}
          toggleExpand={toggleExpand}
        />
      );
    });
  }
  toggleExpandFn=(e:React.MouseEvent<HTMLDivElement>) => {
    const dom = e.currentTarget!;
    const index = dom.dataset.index!;
    this.props.toggleExpand(index);
  }

  render () {
    const {lev, node, index, fieldObj, formatterDropItem} = this.props;
    // 层级间的距离左侧的距离
    const levSpaceStyle =  { paddingLeft: `${lev}em`, };
    const  text = formatterDropItem
      ? formatterDropItem(node)
      : node.get(fieldObj.get("textField"));
    const expand = node.get("expand");
    const child = node.get(fieldObj.get("childField")!) as immutableData<T>;
    return (
      <li className="combo-par-item">
        <div
          className={`m-combo-item`}
          data-index={index}
          onClick={this.toggleExpandFn}>
          <span
            className="g-item-text"
            style={levSpaceStyle}
          >
            {this.getCheckbox(text as string, expand)}
          </span>
          <SvgIcon className={`arrow-${expand ? "up" : "down"}`} />
        </div>
        <SlideBox slide={expand} >
          <ul>{this.getSubCom(child, lev, index)}</ul>
        </SlideBox>
      </li>
    );
  }
}


export default ParTreeItem;
