/**
 * @name 表格区域视图
 * @description 可以区分固定列和活动列
 * @time 2020-03-13
 */
import * as React from "react";
import ParTree from "./ParTree";
import TrItem from "./TrItem";
import { ICommon } from "./mytreeTable";
type Props<T> = {
  data: ICommon<T>["data"];
  config: ICommon<T>["config"];
  fixObj: ICommon<T>["fixObj"];
  viewIndex: number;
  changeState: ICommon<T>["changeState"];
  setTabBodyDom(dom: HTMLDivElement, index: number): void;
  changeScrollTop(top: number, viewIndex: number): void;
};
type States = {
};
interface ITabView {
  getBody(): JSX.Element;
}
class TabView<T extends AnyObj>
  extends React.PureComponent<Props<T>, States>
  implements ITabView {
  colHeadRef: React.RefObject<HTMLDivElement> = React.createRef();
  tabBodyRef: React.RefObject<HTMLDivElement> = React.createRef();
  state: States = {};

  scrollFn = (e: React.UIEvent<HTMLDivElement>) => {
    if (!e.currentTarget.classList.contains("action-body")) {
      return;
    }
    const { changeScrollTop, viewIndex } = this.props;
    const dom = e.currentTarget;
    const left = dom.scrollLeft;
    const colHead = this.colHeadRef.current!;
    colHead.scrollLeft = left;
    changeScrollTop(dom.scrollTop, viewIndex);
  };
  gethead () {
    const {
      config: { child: cols },
    } = this.props;
    const tds = cols.map((val) => {
      const { text, width, field } = val;
      return (
        <th style={{ width: width }} className="td-border" key={field}>
          {text}
        </th>
      );
    });
    return (
      <div className="tab-head">
        <table>
          <thead>
            <tr>{tds}</tr>
          </thead>
        </table>
      </div>
    );
  }
  createColgroup () {
    const {
      config: { child: cols },
    } = this.props;
    const arr = cols.map((val) => {
      const { width, field } = val;
      const style = width ? { width } : undefined;
      return <col style={style} key={field} />;
    });
    return <colgroup>{arr}</colgroup>;
  }

  componentDidMount () {
    const { setTabBodyDom, viewIndex, config } = this.props;
    if (!config.forzen) {
      this.overBox();
    }
    const { current } = this.tabBodyRef;
    setTabBodyDom(current!, viewIndex);
    // 添加滚轮事件
    if (config.forzen) {
      // 直接绑定在dom上，避免绑定在react上导致滚动的时候报 passive的错误，滚动表格带动整个页面的滚动条滚动
      current!.addEventListener("wheel", this.wheelFn);
    }
  }
  componentWillUnmount () {
    const { config } = this.props;
    if (config.forzen) {
      this.tabBodyRef.current!.removeEventListener("wheel", this.wheelFn);
    }
  }
  // 有滚动条的时候
  overBox () {
    const tbodyDom = this.tabBodyRef.current!;
    if (tbodyDom.scrollWidth > tbodyDom.clientWidth) {
      // 给自己的头部隐藏的滚动条占位
      const child = this.colHeadRef.current!
        .firstElementChild as HTMLDivElement;
      child!.style.paddingRight = "18px";
    }
  }
  // 鼠标滚动事件，固定列区的滚动事件
  wheelFn = (e: WheelEvent) => {
    e.preventDefault();
    const { changeScrollTop, viewIndex } = this.props;
    const deltay = e.deltaY; // 每滚动一下，滚动的距离
    const top = this.tabBodyRef.current!.scrollTop;
    const distance = top + deltay;
    this.tabBodyRef.current!.scrollTop = distance;

    changeScrollTop(distance, viewIndex);
  };
  makeSign = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.type;
    const dom = e.currentTarget;
    if (type === "mouseenter") {
      dom.classList.add("action-body");
    } else if (type === "mouseleave") {
      dom.classList.remove("action-body");
    }
  };
  getBody () {
    const {
      data,
      fixObj,
      fixObj: { idField, childField },
      config,
      viewIndex,
      changeState,
    } = this.props;
    const { child: cols } = config;
    let order = { order: 0 };
    const trs = data.map((val, index) => {
      const arr = val.get(childField);
      const id = val.get(idField);
      const isMainView = viewIndex === 0;
      if (arr && arr.size) {
        return (
          <ParTree
            key={id}
            order={order}
            changeState={changeState}
            lev={0}
            index={`${index}`}
            node={val}
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
            node={val}
            index={`${index}`}
            changeState={changeState}
            cols={cols}
            isMainView={isMainView}
            lev={0}
            fixObj={fixObj}
          />
        );
      }
    });
    const colgroup = this.createColgroup();
    const fn = !config.forzen ? this.scrollFn : undefined;
    const makeSignFn = !config.forzen ? this.makeSign : undefined;

    return (
      <div
        className="tab-body-main"
        onScroll={fn}
        onMouseEnter={makeSignFn}
        onMouseLeave={makeSignFn}
        ref={this.tabBodyRef}
      >
        <table>
          {colgroup}
          <tbody>{trs}</tbody>
        </table>
      </div>
    );
  }

  render () {
    const {
      config: { width, forzen },
      config,
    } = this.props;
    const styleObj = width && forzen ? { width } : undefined;

    const className = config.forzen ? "tab-view-fix" : "tab-view-scroll";
    return (
      <div className={`${className} tab-viewBody`} style={styleObj}>
        <div className="tab-head-wrap" ref={this.colHeadRef}>
          {this.gethead()}
        </div>
        <div className="tab-body-wrap">{this.getBody()}</div>
      </div>
    );
  }
}

export default TabView;
