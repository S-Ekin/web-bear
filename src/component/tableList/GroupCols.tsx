/**
 * @name 列头组
 * @description 把固定列分组，好划分区域，最终作用不是生成任何html，只是用作生成配置列头的数据
 * @time 2020-03-10
 */
import * as React from "react";
import {ICommon, IColumnItem} from "./mytablist";
type Props<T>=ICommon<T>['groupCol'];
type States={

};


class GroupCols<T extends AnyObj> extends React.PureComponent<Props<T>, States> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static colItem = <K extends AnyObj>(_prop:React.PropsWithChildren<IColumnItem<K> & {children:string}>) => <></>
  state:States={
  };
  render () {
    return '';
  }
}


export  {GroupCols};
