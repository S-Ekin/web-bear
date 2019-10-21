import * as React from "react";


type commonInterface = CalendarSpace.commonInterface;


type CalendarMonthViewProp = {
	curTime: commonInterface["curTime"];
	showTimeObj: commonInterface["showTimeObj"];
	selTimeObj: commonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
	rotate: commonInterface["rotate"];
}

type CalendarMonthViewState = {



}


interface CalendarMonthViewApi {

}



export default class CalendarMonthView extends React.PureComponent<CalendarMonthViewProp, CalendarMonthViewState> implements CalendarMonthViewApi {

	static monFormatter = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];

	render() {


		const { curTime: { year, month }, selTimeObj, clickSelHandle, showTimeObj } = this.props;

		const selYear = selTimeObj.get("year");
		const selMonth = selTimeObj.get("month");

		const showYear = showTimeObj.get("year");

		let startMon = 0;

		const mon_today = year === showYear;
		const mon_sel = selYear === showYear;

		return (<div className="m-monthView item-calendar-view">
			{
				Array.from({ length: 4 }, (...args) => (args[1] + 1)).map(row => {


					return (

						<ul className="mon-group" key={row}>
							{
								Array.from({ length: 3 }, (...args) => (args[1] + 1)).map(() => {

									const num = ++startMon;

									const monToday = mon_today && month === num && "calendar-today" || "";
									const monSel = mon_sel && selMonth === num && "calendar-sel" || "";

									return (<li data-num={num} key={num} data-sign="month" className={"view-item " + monToday + " " + monSel} onClick={!monSel ? clickSelHandle:undefined}>
										<span className="mon-span">{CalendarMonthView.monFormatter[num]}</span>
									</li>)
								})
							}

						</ul>
					)
				})
			}

		</div>)

	}
}