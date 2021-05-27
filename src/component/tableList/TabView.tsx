/**
 * @name 表格区域视图
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import TrItem from './TrItem';
import {ICommon} from "./mytablist";
import {SvgIcon} from '../my-icon/index';
type Props<T>={
  data:ICommon<T>['data'];
  config:ICommon<T>['config'];
  fixObj:ICommon<T>['fixObj'];
  viewIndex:number;
  startIndex:number;
  changeState:ICommon<T>['changeState'];
  changeScrollTop(top:number, viewIndex:number):void;
  setTabBodyDom(dom:HTMLElement, viewIndex:number):void;
};
type States={

};
interface ITabView {
  scrollFn(e:React.UIEvent<HTMLDivElement>):void;
  overBox():void;
  wheelFn(e:WheelEvent):void;
  makeSign(e:React.MouseEvent<HTMLDivElement>):void;
}
class TabView<T extends AnyObj> extends React.PureComponent<Props<T>, States> implements ITabView {

  state:States={

  };
  colHeadRef:React.RefObject<HTMLDivElement> = React.createRef();
  tabBodyRef:React.RefObject<HTMLDivElement> = React.createRef();
  scrollFn=(e:React.UIEvent<HTMLDivElement>) => {
    // 有标记的才能滚动
    if (!e.currentTarget.classList.contains('action-body')) {
      return;
    }
    const {changeScrollTop, viewIndex} = this.props;
    const dom = e.currentTarget;
    const left = dom.scrollLeft;
    const colHead = this.colHeadRef.current!;
    colHead.scrollLeft = left;
    changeScrollTop(dom.scrollTop, viewIndex);

  }
  // 有滚动条的时候
  overBox () {

    const tbodyDom = this.tabBodyRef.current!;
    const {config: {forzen}} = this.props;
    if (!forzen && tbodyDom.scrollHeight > tbodyDom.clientHeight) {
      // 给自己的头部隐藏的滚动条占位
      const child = this.colHeadRef.current!.firstElementChild as HTMLDivElement;
      child!.style.paddingRight = "18px";
    }
  }

  wheelFn=(e:WheelEvent) => {
    e.preventDefault();
    const {changeScrollTop, viewIndex} = this.props;
    const deltay  = e.deltaY; // 每滚动一下，滚动的距离
    const top = this.tabBodyRef.current!.scrollTop;
    const distance = top + deltay;
    this.tabBodyRef.current!.scrollTop = distance;
    changeScrollTop(distance, viewIndex);
  }
  // 用鼠标的进入做标记
  makeSign=(e:React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.type;
    const dom = e.currentTarget;
    if (type === "mouseenter") {
      dom.classList.add('action-body');
    } else if (type === "mouseleave") {
      dom.classList.remove('action-body');
    }
  }
  checkAll=(e:React.MouseEvent<HTMLSpanElement>) => {
    const dom = e.currentTarget;
    const status = dom.dataset.status;

    this.props.changeState(status!, 'checkPar');

  }
  getCheckAll () {
    const {data} = this.props;
    const allChecked = data.every((val) => {
      const status = val.get('checked');
      return status;
    });

    const hasCheck = data.some((val) => val.get('checked'));
    const status = allChecked ? "checkbox-marked" : hasCheck ? 'checkbox-has-selected' : "checkbox-blank";
    return (
      <span onClick={this.checkAll} data-status={allChecked}>
        <SvgIcon className={status} />
      </span>
    );
  }
  gethead () {
    const {config: {child: cols}, } = this.props;
    const tds = cols.map((val) => {
      const {text, width, field} = val;
      const txt = field === "check" ? this.getCheckAll() : text;
      return (
        <th style={{width: width, }} className="td-border" key={field}>{txt}</th>
      );
    });
    return (
      <div className="tab-head" >
        <table>
          <thead>
            <tr>{tds}</tr>
          </thead>
        </table>
      </div>
    );
  }
  createColgroup () {
    const {config: {child: cols}} = this.props;
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
  componentDidMount () {
    const {config, setTabBodyDom, viewIndex} = this.props;
    const dom = this.tabBodyRef.current;
    if (!dom) {
      return;
    }
    if (!config.forzen) {
      this.overBox();
    }
    setTabBodyDom(dom, viewIndex);
    // 添加滚轮事件
    const {current} = this.tabBodyRef;
    if (config.forzen) {
      // 直接绑定在dom上，避免绑定在react上导致滚动的时候报 passive的错误，滚动表格带动整个页面的滚动条滚动
      current!.addEventListener("wheel", this.wheelFn);
    }
  }
  componentWillUnmount () {
    const {config} = this.props;
    if (config.forzen) {
      this.tabBodyRef.current!.removeEventListener("wheel", this.wheelFn);
    }
  }
  getBody () {
    const {data, fixObj, fixObj: {idField}, config, viewIndex, changeState, startIndex} = this.props;
    const {child: cols} = config;
    const trs = data.map((val, index) => {
      const id = val.get(idField);
      const isMainView = viewIndex === 0;
      return (
        <TrItem
          key={id}
          node={val}
          index={`${index + 1 + startIndex}`}
          changeState={changeState}
          cols={cols}
          isMainView={isMainView}
          fixObj={fixObj}
        />
      );

    });
    const colgroup = this.createColgroup();
    const fn = !config.forzen ? this.scrollFn : undefined;
    const makeSignFn = !config.forzen ? this.makeSign : undefined;

    return (
      <div className="tab-body-main"
        onScroll={fn}
        onMouseEnter={makeSignFn}
        onMouseLeave={makeSignFn}
        ref={this.tabBodyRef}
      >
        <table>
          {colgroup}
          <tbody>
            {trs}
          </tbody>
        </table>
      </div>
    );
  }
  getMainBody () {
    return (
      <div className="tab-body-wrap">
        {this.getBody()}
      </div>
    );
  }
  render () {
    const {config: {width, forzen}, config} = this.props;
    const styleObj = width && forzen ? {width} : undefined;

    const className = config.forzen ? "tab-view-fix" : "tab-view-scroll";
    return (
      <div className={`${className} tab-viewBody`} style={styleObj}>
        <div className="tab-head-wrap" ref={this.colHeadRef}>
          {this.gethead()}
        </div>
        {this.getMainBody()}
      </div>
    );
  }
}

export default TabView;
