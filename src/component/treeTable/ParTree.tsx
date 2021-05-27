/**
 * @name 父子节点组件
 * @description description
 * @time 2020-03-13
 */
import * as React from "react";
import TrItem from './TrItem';
import { SlideBox } from "../animate/index";
import {ICommon} from "./mytreeTable";
type Props<T>={
  cols:ICommon<T>['col'][];
  node:IImmutalbeMap<ICommon<T>['node']>;
  fixObj:ICommon<T>['fixObj'];
  lev:number;
  order:{order:number};
  index:string; // 节点的索引
  isMainView?:boolean;
  changeState:ICommon<T>['changeState'];
};
type States={

};
interface IParTree {
  getSubBody():IImmutalbeList<JSX.Element>;
}
class ParTree<T extends AnyObj> extends React.PureComponent<Props<T>, States> implements IParTree {


  state:States={

  };
  createColgroup () {
    const {cols} = this.props;
    const arr = cols.map((val) => {
      const {width, field} = val;
      const style = width ? {width} : undefined;
      return (
        <col style={style} key={field}/>
      );
    });
    return (
      <colgroup>
        {arr}
      </colgroup>
    );

  }
  getSubBody () {

    const {node, fixObj, fixObj: {childField, idField}, cols, lev, isMainView, index, changeState, order}  = this.props;
    const arr:ICommon<T>['data'] = node.get(childField);
    return arr.map((val, oindex) => {
      const children = val.get(childField);
      const id = val.get(idField);

      if (children && children.size) {
        return (
          <ParTree
            order={order}
            key={id}
            node={val}
            index={`${index},${oindex}`}
            lev={lev + 1}
            changeState={changeState}
            cols={cols}
            isMainView={isMainView}
            fixObj={fixObj}
          />
        );
      } else {

        return (
          <TrItem
            key={id}
            order={order}
            lev={lev + 1}
            node={val}
            index={`${index},${oindex}`}
            changeState={changeState}
            cols={cols}
            isMainView={isMainView}
            fixObj={fixObj}
          />
        );
      }
    });

  }
  render () {
    const {cols, fixObj, node, lev, isMainView, index, changeState, order} = this.props;
    const colgroup = this.createColgroup();
    const expand = node.get('expand');

    return (
      <>
        <TrItem
          node={node}
          fixObj={fixObj}
          cols={cols}
          lev={lev}
          order={order}
          changeState={changeState}
          index={index}
          isMainView={isMainView}
          isPar
        />
        <tr className="tree-td">
          <td colSpan={cols.length}>
            <SlideBox slide={expand} >
              <div className="tab-body">
                <table>
                  {colgroup}
                  <tbody>
                    {this.getSubBody()}
                  </tbody>
                </table>
              </div>
            </SlideBox>
          </td>
        </tr>


      </>

    );
  }
}


export default ParTree;
