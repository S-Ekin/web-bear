/**
 * @name 一般的td
 * @description description
 * @time 2020-03-14
 */
import * as React from "react";
import { SvgIcon } from "../my-icon/index";
import { activeStatus } from "./formatterTreeData";
import { ICommon } from "./mytreeTable";
import {IImmutalbeMap} from "../util/immutableUtil";
type Props<T> = {
  cols: ICommon<T>["col"][];
  node: IImmutalbeMap<ICommon<T>["node"]>;
  fixObj: ICommon<T>["fixObj"];
  lev: number; // 层级
  index: string; // 节点的索引
  isPar?: boolean;
  order: { order: number };
  isMainView?: boolean;
  changeState: ICommon<T>["changeState"];
};
type States = {
};
interface IItem {
  getFirstText(text: string): JSX.Element;
}
class Item<T extends AnyObj>
  extends React.PureComponent<Props<T>, States>
  implements IItem {
  state: States = {};

  getCheck () {
    const {
      fixObj: { multiply },
    } = this.props;
    if (multiply) {
      const { node } = this.props;
      const active =
        node.get("active") === activeStatus.hasSelect
          ? "checkbox-has-selected"
          : node.get("active") === activeStatus.noSelect
            ? "checkbox-blank"
            : "checkbox-marked";
      return <SvgIcon className={active} />;
    } else {
      return undefined;
    }
  }
  slideIconEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const index = e.currentTarget.parentElement!.parentElement!.dataset.index!;
    this.props.changeState(index, "expand");
  };
  getIcon () {
    const {
      node,
      isPar,
      fixObj: { itemIcon = "file", multiply },
    } = this.props;
    if (isPar) {
      const expand = node.get("expand");
      return (
        <>
          <span onClick={multiply ? this.slideIconEvent : undefined}>
            <SvgIcon className={expand ? "minus" : "plus"} />
          </span>
          <SvgIcon className={expand ? "folder-open" : "folder"} />
        </>
      );
    } else {
      return <SvgIcon className={itemIcon} />;
    }
  }
  clickFn = (e: React.MouseEvent<HTMLDivElement>) => {
    const index = e.currentTarget.dataset.index!;
    const { changeState } = this.props;
    changeState(index, "expand");
  };
  checkFn = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    const dom = e.currentTarget;
    const index = dom.parentElement!.dataset.index;
    const { changeState, isPar } = this.props;
    changeState(index!, isPar ? "checkPar" : "active");
  };
  getFirstText (text: string) {
    const {
      lev,
      isPar,
      index,
      fixObj: { multiply },
    } = this.props;
    const fn = isPar ? this.clickFn : undefined;
    const className = isPar ? "tree-par" : undefined;
    const check = multiply ? this.checkFn : undefined;
    const checkName = multiply ? "tree-check" : undefined;
    return (
      <div onClick={fn} className={className} data-index={index}>
        <span onClick={check} className={checkName}>
          <span style={{ paddingRight: lev * 14 }} />
          {this.getCheck()}
          {this.getIcon()}
          {text}
        </span>
      </div>
    );
  }

  getOrder () {
    const { order } = this.props;
    order.order++;
    return order.order;
  }

  render () {
    const {
      cols,
      node,
      fixObj: { tabField, noOrder },
      isMainView,
    } = this.props;

    const tds = cols.map((td, index) => {
      const { field, formatter, align } = td;
      const text = formatter
        ? formatter(node, index, tabField)
        : node.get(field);
      let str;
      let alignName = align ? `td-${align}` : "";
      if (isMainView) {
        if (noOrder) {
          str = index === 0 ? this.getFirstText(text as string) : text;
        } else {
          str =
            index === 0
              ? this.getOrder()
              : index === 1
                ? this.getFirstText(text as string)
                : text;
          alignName = index === 1 ? "" : alignName;
        }
      } else {
        str = text;
      }
      return (
        <td key={field} className={`td-border ${alignName}`}>
          {str}
        </td>
      );
    });

    return <tr>{tds}</tr>;
  }
}

export default Item;
