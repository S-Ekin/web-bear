/**
 * @name 页码
 * @description description
 * @time 2019-09-19
 */
import {ITableFn, Inode} from "./mytable";
import * as React from "react";
import { Combobox } from "../combo/index";
import { SvgIcon } from "../my-icon/index";
import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";

type Props<T> = {
  perNums: number; // 每页条数
  curPage: number; // 当前的页码
  totalPages: number; // 总页数
  tableData: IImmutalbeList<IImmutalbeMap<Inode & T>>; // 当前页的数据
  changeHandle: ITableFn<T>["changeState"];
};

type States = {

};
interface IPageSize {
  pageCodeHandle(e: React.MouseEvent<HTMLElement>):void;
}
const pageNumsArr = [
  { id: "1", text: "10" },
  { id: "2", text: "20" },
  { id: "3", text: "30" },
  { id: "4", text: "50" },
  { id: "5", text: "100" },
];

class PageSize<T extends AnyObj> extends React.PureComponent<Props<T>, States> implements IPageSize {
  pageCodeHandle = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget!;
    if (target.classList.contains("active")) {
      return;
    }
    const { changeHandle } = this.props;
    const num = ~~target.dataset.num!;
    changeHandle<"curPage">("curPage", num);
  }
  curNumInpHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { totalPages, changeHandle } = this.props;

    let val = ~~e.currentTarget!.value.trim();
    val = +val < 1 ? 1 : +val > totalPages ? totalPages : val;
    changeHandle<"curPage">("curPage", val);
  }

  firstPage () {
    const { totalPages, curPage } = this.props;
    const arr = Array.from({ length: 5 }, (...args) => args[1] + 1);

    const first = arr.map((val) => (
      <span
        className={"m-page-num " + (val === curPage ? "active" : "")}
        key={val}
        data-num={val}
        onClick={this.pageCodeHandle}>
        {val}
      </span>
    ));
    const className = "m-page-num " + (totalPages === curPage ? "active" : "");
    return (
      <React.Fragment>
        {first}
        <span>...</span>
        <span
          className={className}
          data-num={totalPages}
          onClick={this.pageCodeHandle}>
          {totalPages}
        </span>
      </React.Fragment>
    );
  }
  lastPage () {
    const { totalPages, curPage } = this.props;
    const arr = Array.from({ length: 5 }, (...args) => args[1] + 1);
    const last = arr.map((val) => {

      const className = 	"m-page-num " + (totalPages - 5 + val === curPage ? "active" : "");

      return (
        <span
          className={className}
          data-num={totalPages - 5 + val}
          onClick={this.pageCodeHandle}
          key={totalPages - 5 + val}>
          {totalPages - 5 + val}
        </span>
      );
    });
    return (
      <React.Fragment>
        <span
          className={"m-page-num " + (1 === curPage ? "active" : "")}
          data-num={1}
          onClick={this.pageCodeHandle}>
          {1}
        </span>
        <span>...</span>
        {last}
      </React.Fragment>
    );
  }
  centerPage () {
    const { curPage, totalPages } = this.props;
    const arr = Array.from({ length: 5 }, (...args) => args[1] + 1);

    const center = arr.map((val) => {


      const className = "m-page-num " + (curPage - 3 + val === curPage ? "active" : "");

      return (

        <span
          data-num={curPage - 3 + val}
          onClick={this.pageCodeHandle}
          className={className}
          key={curPage - 3 + val}>
          {curPage - 3 + val}
        </span>
      );
    });
    const className = "m-page-num " + (totalPages === curPage ? "active" : "");
    return (
      <React.Fragment>
        <span
          className={"m-page-num " + (1 === curPage ? "active" : "")}
          data-num={1}
          onClick={this.pageCodeHandle}>
          {1}
        </span>
        <span>...</span>
        {center}
        <span>...</span>
        <span
          className={className}
          data-num={totalPages}
          onClick={this.pageCodeHandle}>
          {totalPages}
        </span>
      </React.Fragment>
    );
  }
  normalPage () {
    const { curPage, totalPages } = this.props;

    const arr = Array.from(
      { length: totalPages },
      (...args) => args[1] + 1
    );
    return arr.map((val) => {
      const className = "m-page-num " + (val === curPage ? "active" : "");
      return (
        <span
          className={className}
          data-num={val}
          onClick={this.pageCodeHandle}
          key={val}>
          {val}
        </span>
      );
    });
  }

  controlBtnHandle = (e: React.MouseEvent<HTMLSpanElement>) => {
    const type = e.currentTarget!.dataset.type;
    const { curPage, totalPages, changeHandle } = this.props;
    if (type === "pre") {
      changeHandle<"curPage">("curPage", Math.max(+curPage - 1, 1));
    } else {
      changeHandle<"curPage">(
        "curPage",
        Math.min(+curPage + 1, totalPages)
      );
    }
  }
  perNumComboClick = (selectedArr: AnyObj[]) => {
    this.props.changeHandle<"perNums">("perNums", +selectedArr[0].text);
    this.props.changeHandle<"curPage">("curPage", 1);
  }
  render () {
    const { totalPages, curPage, perNums, tableData} = this.props;
    let navigatepageCom;
    const totalNums = tableData.size;
    if (totalPages < 11) {
      navigatepageCom = this.normalPage();
    } else if (curPage - 1 < 4) {
      navigatepageCom = this.firstPage();
    } else if (totalPages - curPage < 4) {
      navigatepageCom = this.lastPage();
    } else {
      navigatepageCom = this.centerPage();
    }
    const perNumId = pageNumsArr.find((val) => ~~val.text === perNums)!.id;
    return (
      <div className="g-pageCode">
        <div className="g-pageLeft">
          <div className="m-page-total">
            <span>共 {totalPages} 页</span>

            <span>{totalNums}条</span>
          </div>

        </div>

        <div className="g-pageRight">
          <div className="m-code-number">
            <span
              className="m-page-num"
              data-type="pre"
              onClick={this.controlBtnHandle}>
              <SvgIcon className="arrow-left" />
            </span>
            <span>{navigatepageCom}</span>
            <span
              className="m-page-num"
              onClick={this.controlBtnHandle}
              data-type="next">
              <SvgIcon className="arrow-right" />

            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", margin: "0 16px 0 16px", }}>
            <Combobox
              noSearch
              field="pageNums"
              data={pageNumsArr}
              width={80}
              directionUp
              clickCallback={this.perNumComboClick}
              defaultVal={perNumId}
            />
            <span>&nbsp;条/页</span>
          </div>
          <div >
            <span>跳至</span>
            <input
              className="j-jump-page s-inp normal"
              value={curPage}
              type="number"
              min={1}
              onChange={this.curNumInpHandle}
            />
            <span>页</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PageSize;
