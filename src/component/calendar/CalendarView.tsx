/**
 * @name 日历视图
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import CalendarDayView from "./CalendarDayView";
import CalendarYearView from "./CalendarYearView";
import CalendarMonthView from "./CalendarMonthView";
import CalendarSearsonView from "./CalendarSearsonView";
import { Animate } from "../animate/index";
import * as Immutable from "immutable";
import {SvgIcon} from "../my-icon/index";
import {ICommonInterface, ICalendarStates } from "./calendar";
import {getLastYear} from './objectFn';
import {IImmutalbeMap} from "../util/immutableUtil";

// eslint-disable-next-line no-shadow
enum calendarType {
  year = 1,
  searson = 2,
  month = 3,
  day = 4,
}

type Props = {
  selTimeObj: ICommonInterface["showTimeObj"];
  showTimeObj: ICommonInterface["showTimeObj"];
  showViewArr: ("fadeIn" | "fadeOut")[];
  viewIndex: 0 | 1;
  excludeRotate: string, // 1,2,3,4 ,排除的频率类型
  rotate:ICommonInterface["rotate"],
  curTime: ICommonInterface["curTime"];
  lastYear: number;
  fixProps: ICommonInterface['fixProps'];
  changeBasicState:ICommonInterface["changeBasicState"];
};

type States = {
};

interface ICalendarView {
  changeSelTimeItme(viewIndex: number):void;

}
export default class CalendarView
  extends React.PureComponent<Props, States>
  implements ICalendarView {

  updatePanelYears (movePre: "next" | "back") {
    const { viewIndex } = this.props;
    this.props.changeBasicState("pannelLastYear", function (state) {
      let lastYear = state.pannelLastYear.get(viewIndex)!;
      lastYear = movePre === "back" ? lastYear - 10 : lastYear + 1;

      let index = lastYear % 10;
      index = index === 0 ? 10 : index;

      lastYear = lastYear - index + 10;
      return state.pannelLastYear.set(viewIndex, lastYear);
    });
  }
  changeSelTimeItme = (
    viewIndex: number,
  ) => {
    const { changeBasicState, rotate, fixProps: { style }} = this.props;
    changeBasicState<"selTimeArr">("selTimeArr", function (states:ICalendarStates) {

      const { year, month, day, searson } = states.showTimeArr.get(viewIndex)!.toJS();
      let selTimeArr = states.selTimeArr;

      if (!selTimeArr.size) {
        selTimeArr = Immutable.fromJS([{ year: "" }]);
      }

      switch (rotate) {
        case calendarType.day:
          selTimeArr = selTimeArr.update(viewIndex, (map) => map.withMutations((node) =>
            node
              .set("year", year)
              .set("month", month)
              .set("day", day)
              .set("searson", Math.ceil(month / 3))
          ));

          break;
        case calendarType.searson: {
          selTimeArr = selTimeArr.update(viewIndex, (map) => map.withMutations((node) =>
            node
              .set("year", year)
              .set("month", searson * 3 - 2)
              .set("searson", searson)
          ));

          break;
        }
        case calendarType.year: {
          selTimeArr = selTimeArr.update(viewIndex, (map) => map.withMutations((node) =>
            node.set("year", year)
          ));
          break;
        }
        case calendarType.month: {
          selTimeArr = selTimeArr.update(viewIndex, (map) => map.withMutations((node) =>
            node
              .set("year", year)
              .set("month", month)
              .set("searson", Math.ceil(month / 3))
          ));
          break;
        }
        default:
          break;
      }

      if (style === 2 && !states.selTimeArr.getIn([0, "year"])) {
        selTimeArr = selTimeArr.set(1 - viewIndex, selTimeArr.get(viewIndex)!);
      }

      return selTimeArr;

    });

  }

  clickSelHandle = (e: React.MouseEvent<HTMLElement>) => {
    const dataset = e.currentTarget.dataset;
    const type = dataset.sign as "day" | "year" | "month" | "searson";
    const num = ~~dataset.num!;
    const { viewIndex, changeBasicState, fixProps: {style}} = this.props;

    const flag = { [type]: num };
    const _showTimeobj = Object.assign(
      {},
      this.props.showTimeObj.toJS(), // 这里不能用选择的时间，因为selTime 是 7月12日，而切换到12月再点击10日，则会有完全不同的时间
      flag
    );

    // 比较开始和结束的大小
    const startGtEnd = changeBasicState<"selTimeArr">("selTimeArr", (state) => state.selTimeArr, {
      viewIndex,
      showTimeObj: _showTimeobj
    });

    if (startGtEnd) {
      return;
    }
    // 要同步showTime 和 selTime 不然比较会出错
    changeBasicState("showTimeArr", function (state) {
      let showTimeArr = state.showTimeArr.setIn([viewIndex, type], num);
      if (style === 2 && !state.selTimeArr.getIn([0, "year"])) {
        showTimeArr = showTimeArr.set(1 - viewIndex, showTimeArr.get(0)!);
      }
      return showTimeArr;
    });
    const {rotate, showViewArr} = this.props;
    this.changeSelTimeItme(viewIndex);
    // 判断当前选的频率是不是和面板显示的频率一样
    const panelRotate = showViewArr.findIndex((val) => val === "fadeIn");
    if (rotate !== panelRotate) {
      changeBasicState<"showViewArr">("showViewArr", function () {
        let animationArr:ICalendarStates["showViewArr"] = new Array(5).fill("fadeOut");
        animationArr[rotate] = "fadeIn";
        return animationArr;
      });
    }
  }

  updatePanelDays (movePre: "next" | "back") {
    const { changeBasicState, viewIndex, showTimeObj } = this.props;

    const year = showTimeObj.get("year"),
      month = showTimeObj.get("month");

    let updataMon = 1,
      updataYear = 1;

    switch (movePre) {
      case "back":
        updataMon = month - 1 === 0 ? 12 : month - 1;
        updataYear = month - 1 === 0 ? year - 1 : year;
        break;
      case "next":
        updataMon = month + 1 === 13 ? 1 : month + 1;
        updataYear = month + 1 === 13 ? year + 1 : year;
        break;
    }
    changeBasicState("showTimeArr", (states) => states.showTimeArr.updateIn([viewIndex], (map) => map.withMutations((maps:IImmutalbeMap<ICommonInterface["curTime"]>) =>
      maps
        .set("year", updataYear)
        .set("month", updataMon)
        .set("searson", Math.ceil(month / 3))
    )));
  }
  // 改变选择的面板
  changeView = (e: React.MouseEvent<HTMLSpanElement>) => {
    const type = e.currentTarget.dataset.sign as ("year" | "month" | "day");
    const {rotate} = this.props;

    this.props.changeBasicState<"showViewArr">("showViewArr", function (states) {
      // 找出当前显示的面板频率
      const preIndex = states.showViewArr.findIndex((val) => val === "fadeIn");

      let showViewArr = [...states.showViewArr];
      showViewArr[preIndex] = "fadeOut";

      if (preIndex === rotate) {
					 showViewArr[calendarType[type]] = "fadeIn";
      } else {
        showViewArr[rotate] = "fadeIn";
      }
      return showViewArr;
    });
  }

  changeRotate = (e: React.MouseEvent<HTMLElement>) => {
    const dom = e.currentTarget;
    if (dom.classList.contains("active")) {
      return;
    }

    const id = (+e.currentTarget!.dataset.id!) as ICommonInterface["rotate"];
    this.props.changeBasicState<"rotate">("rotate", function () {
      return id;
    });

    // 切换频率时，让面板显示时间是选择的时间
    if (this.props.selTimeObj.get("year")) {
      this.props.changeBasicState("showTimeArr", function (state) {
        return state.selTimeArr;
      });
    }

    // 修改面板的年，让年回到当前显示的年的那个面板
    this.props.changeBasicState("pannelLastYear", function (state) {
      return state.showTimeArr.map((val) => getLastYear(val.get("year")));
    });

    if (id === 4) { // 防止上次日选的是 31 ，再切换为日时，最大是30
      this.props.changeBasicState("selTimeArr", function (state) {
        return state.selTimeArr.map((val) => val.set("day", 1));
      });
    }
  }
  controlBtnHandle = (e: React.MouseEvent<HTMLSpanElement>) => {
    const dataset = e.currentTarget.dataset;
    const type = dataset.sign! as "next" | "back";
    const curViewIndex = +dataset.curviewindex!;

    curViewIndex === calendarType.day
      ? this.updatePanelDays(type)
      : this.updatePanelYears(type);
  }
  getRotateCombo (arr:string[]) {
    const {rotate, excludeRotate}  = this.props;
    const excludeArr = excludeRotate.split(",");
    return arr.map((val, index) => {
      const active = index === rotate - 1;
      const id = index + 1;
      return !excludeArr.includes(String(id)) ? (
        <li
          className={(active && "active") || ""}
          data-id={id}
          onClick={this.changeRotate}
          key={index}>
          {val}
        </li>
      ) : null;
    });
  }
  getSelTime () {
    const {showTimeObj} = this.props;
    const {rotate} = this.props;
    if (rotate === calendarType.day) {
      const year = showTimeObj.get("year");
      const month = `${showTimeObj.get("month")}`.padStart(2, "0");
      return (
        <div>
          <i className="fa fa-calendar" />
								&nbsp;
          <span
            data-sign="year"
            onClick={this.changeView}>
            {year}/
          </span>
          <span
            data-sign="month"
            onClick={this.changeView}>
            {month}
          </span>
        </div>
      );
    } else if (rotate !== calendarType.year) {
      return (
        <div>
          <i className="fa fa-calendar" />
								&nbsp;
          <span
            data-sign="year"
            onClick={this.changeView}>
            {showTimeObj.get("year")}年
          </span>
        </div>
      );
    } else {
      return undefined;
    }
  }

  changeTime = (e: React.ChangeEvent<HTMLInputElement>) => {

    const name = e.currentTarget.name as 'hour' | 'minute';
    const viewIndex = +e.currentTarget.dataset.viewindex!;
    const {changeBasicState} = this.props;
    let value =  ~~e.currentTarget.value;
    value = name === "hour" ? (value > 23 ? 23 : value) : (value > 59 ? 59 : value);
    const flag = { [name]: value };
    const _showTimeobj = Object.assign(
      {},
      this.props.selTimeObj.toJS(),
      flag
    );
    // 比较开始和结束的大小
    const startGtEnd = changeBasicState<"selTimeArr">("selTimeArr", (state) => state.selTimeArr, {
      viewIndex,
      showTimeObj: _showTimeobj
    });

    if (startGtEnd) {
      return;
    }

    changeBasicState<"selTimeArr">("selTimeArr", function (states:ICalendarStates) {

      let selTimeArr = states.selTimeArr;

      if (!selTimeArr.size) {
        selTimeArr = Immutable.fromJS([{ year: "" }]);
      }

      selTimeArr = selTimeArr.update(viewIndex, (map) => map.withMutations((node) => node.set(name, value)));
      return selTimeArr;

    });

  }
  render () {
    const {
      curTime,
      selTimeObj,
      viewIndex,
      fixProps: {noChangeRotate, time},
      rotate,
      showViewArr,
      showTimeObj,
			 lastYear
    } = this.props;

    const curViewInde = showViewArr.findIndex((val) => val === "fadeIn");
    const showMoveBtn =
			curViewInde === calendarType.day ||
			curViewInde === calendarType.year;

    let duration = new Array(5).fill(0);

    duration[curViewInde] = 400;

    const arr = ["年", "季", "月", "日"];
    const secondViewName = viewIndex === 1 ? "calendar-view2" : "";
    return (
      <div className={`${secondViewName} g-calendar-view`}>
        <div className="m-viewOpt">
          <div
            style={{ position: "relative", }}
            className={noChangeRotate ? "" : "can-hover"}>
            <span className="curViewType ">
              {arr[curViewInde - 1]}
            </span>
            <ul className="m-rotate-drop">
              {this.getRotateCombo(arr)}
            </ul>
          </div>
          <div className="m-timeSel">
            {this.getSelTime()}
          </div>
          <div
            className={"m-moveBtns " + (showMoveBtn ? "" : "hideMoveBtn")}>
            <button
              className="s-btn"
              onClick={this.controlBtnHandle}
              data-sign="back"
              data-curviewindex={curViewInde}>
              <SvgIcon className="arrow-pre"/>
            </button>
            <button
              className="s-btn"
              onClick={this.controlBtnHandle}
              data-sign="next"
              data-curviewindex={curViewInde}>
              <SvgIcon className="arrow-next"/>
            </button>
          </div>
        </div>
        <div className="m-calendar-view">
          <Animate
            animation={showViewArr[calendarType.day]}
            duration={duration[calendarType.day]}>
            <CalendarDayView
              curTime={curTime}
              selTimeObj={selTimeObj}
              showTimeObj={showTimeObj}
              clickSelHandle={this.clickSelHandle}
              time={time}
              changeTime={this.changeTime}
              viewIndex={viewIndex}
            />
          </Animate>
          <Animate
            animation={showViewArr[calendarType.year]}
            duration={duration[calendarType.year]}>
            <CalendarYearView
              curTime={curTime}
              selTimeObj={selTimeObj}
              showTimeObj={showTimeObj}
              clickSelHandle={this.clickSelHandle}
              rotate={rotate}
              lastYear={lastYear}
            />
          </Animate>
          <Animate
            animation={showViewArr[calendarType.month]}
            duration={duration[calendarType.month]}>
            <CalendarMonthView
              curTime={curTime}
              selTimeObj={selTimeObj}
              showTimeObj={showTimeObj}
              clickSelHandle={this.clickSelHandle}
              rotate={rotate}
            />
          </Animate>
          <Animate
            animation={showViewArr[calendarType.searson]}
            duration={duration[calendarType.searson]}>
            <CalendarSearsonView
              curTime={curTime}
              selTimeObj={selTimeObj}
              showTimeObj={showTimeObj}
              clickSelHandle={this.clickSelHandle}
            />
          </Animate>
        </div>
      </div>
    );
  }
}
