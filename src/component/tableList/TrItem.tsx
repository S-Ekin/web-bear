/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import { SvgIcon } from "../my-icon/index";
import { ICommon } from "./mytablist";

type Props<T> = {
  cols: ICommon<T>["col"][];
  node: IImmutalbeMap<ICommon<T>["node"]>;
  fixObj: ICommon<T>["fixObj"];
  index: string; // 节点的索引
  isMainView?: boolean;
  changeState: ICommon<T>["changeState"];
};
type States = {
};
interface ITrItem {
  getCheck(): JSX.Element | undefined;
}
class TrItem<T extends AnyObj>
  extends React.PureComponent<Props<T>, States>
  implements ITrItem {
  state: States = {};
  getCheck () {
    const { node, index } = this.props;
    const active = node.get("checked") ? "checkbox-marked" : "checkbox-blank";
    return (
      <span onClick={this.checkFn} className="tree-check" data-index={index}>
        <SvgIcon className={active} />
      </span>
    );
  }

  checkFn = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    const dom = e.currentTarget;
    const index = dom.dataset.index;
    const { changeState } = this.props;
    changeState(index!, "active");
  };
  getFirstText (text: React.ReactChild, field: string) {
    const { index } = this.props;

    if (field === "order") {
      return index;
    } else if (field === "check") {
      return this.getCheck();
    } else {
      return text;
    }
  }

  render () {
    const {
      cols,
      node,
      fixObj: { tabField },
      isMainView,
    } = this.props;
    const tds = cols.map((td, index) => {
      const { field, formatter, align } = td;
      const text = formatter
        ? formatter(node, index, tabField)
        : node.get(field);
      const str = isMainView ? this.getFirstText(text, field) : text;

      let alignName = align ? `td-${align}` : "";

      return (
        <td key={field} className={`td-border ${alignName}`}>
          {str}
        </td>
      );
    });

    return <tr>{tds}</tr>;
  }
}

export default TrItem;
