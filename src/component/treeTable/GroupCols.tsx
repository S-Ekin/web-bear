/**
 * @name 列头组
 * @description 把固定列分组，好划分区域，最终作用不是生成任何html，只是用作生成配置列头的数据
 * @time 2020-03-10
 */
import * as React from "react";
import { ICommon, IColumnItem } from "./mytreeTable";

type Props<T> = ICommon<T>["groupCol"];
type States = {
};

class GroupCols<K extends AnyObj> extends React.PureComponent<
Props<K>,
States
> {
  static colItem = <T extends AnyObj>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: React.PropsWithChildren<IColumnItem<T> & { children: string }>
  ) => <></>;
  state: States = {};
  render () {
    return "";
  }
}

export { GroupCols };
