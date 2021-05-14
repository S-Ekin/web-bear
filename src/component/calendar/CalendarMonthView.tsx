/**
 * @name 月组件
 * @description description
 * @time 2019-10-22
 */

import * as React from "react";
import {ICommonInterface} from "./calendar";
interface ICalendarMonthView {
  getMonItemArr():JSX.Element[];
}

type Props = {
  curTime: ICommonInterface["curTime"];
  showTimeObj: ICommonInterface["showTimeObj"];
  selTimeObj: ICommonInterface["showTimeObj"];
  clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
  rotate: ICommonInterface["rotate"];
};

type CalendarMonthViewState = {

};

const monFormatter = [
  "",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];
export default class CalendarMonthView
  extends React.PureComponent<Props, CalendarMonthViewState>
  implements ICalendarMonthView {

  getMonItemArr () {
    const {
      curTime: { year, month },
      selTimeObj,
      clickSelHandle,
      showTimeObj,
    } = this.props;

    const selYear = selTimeObj.get("year");
    const selMonth = selTimeObj.get("month");

    const showYear = showTimeObj.get("year");

    let startMon = 0;

    const isMonToday = year === showYear;
    const issMonSel = selYear === showYear;
    return Array.from({ length: 4 }, (...args) => args[1] + 1).map(
      (row) => {

        const item = Array.from(
          { length: 3 },
          (...args) => args[1] + 1
        ).map(() => {
          const num = ++startMon;
          const monToday = (isMonToday && month === num && "calendar-today") || "";
          const monSel = (issMonSel && selMonth === num && "calendar-sel") || "";
          const className = "view-item " + monToday + " " + monSel;
          return (
            <li
              data-num={num}
              key={num}
              data-sign="month"
              className={className}
              onClick={!monSel ? clickSelHandle : undefined}>
              <span className="mon-span">
                {monFormatter[num]}
              </span>
            </li>
          );
        });
        return (
          <ul className="mon-group" key={row}>
            {item}
          </ul>
        );
      }
    );
  }
  render () {

    return (
      <div className="m-monthView item-calendar-view">
        {this.getMonItemArr()}
      </div>
    );
  }
}
