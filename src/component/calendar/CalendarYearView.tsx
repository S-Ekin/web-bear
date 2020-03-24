/**
 * @name name
 * @description description
 * @time 2019-10-22
 */
import * as React from "react";
import {ICommonInterface} from "./calendar";

interface ICalendarYearView {
getYearArr():JSX.Element[];
}

type Props = {
	curTime: ICommonInterface["curTime"];
	showTimeObj: ICommonInterface["showTimeObj"];
	selTimeObj: ICommonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
	rotate: ICommonInterface["rotate"];
	lastYear: number;
};

type States = {

};

export default class CalendarYearView extends React.PureComponent<Props, States> implements ICalendarYearView  {

	getYearArr(){
		const { curTime: { year }, selTimeObj, clickSelHandle, lastYear } = this.props;
		const selYear = selTimeObj.get("year");

		let startTime = lastYear - 10;

		return  Array.from({ length: 3 }, (...args) => (args[1] + 1)).map(row => {

					const item = Array.from({ length: 3 }, (...args) => (args[1] + 1)).map(() => {

									const num = ++startTime;

									const yearToday = year === num && "calendar-today" || "";
									const yearsel = selYear === num && "calendar-sel" || "";
									const className = "view-item " + yearToday + " " + yearsel;
									return (
										<li
											data-num={num}
											key={num}
											data-sign="year"
											className={className}
											onClick={(!yearsel && clickSelHandle) || undefined}>
											<span className="year-span">
												{num}
											</span>
										</li>
									);
								});
					return (

						<ul className="year-group" key={row} >
							{item}
						</ul>
					);
				});
	}
	render() {

		const { curTime: { year }, selTimeObj, clickSelHandle, lastYear } = this.props;
		const selYear = selTimeObj.get("year");

		const yearToday = year === lastYear && " calendar-today" || "";
		const yearsel = selYear === lastYear && " calendar-sel" || "";

		return (
			<div className="m-yearView item-calendar-view">
				{this.getYearArr()}
				<div
					data-num={lastYear}
					data-sign="year"
					onClick={clickSelHandle}
					className={"last-year view-item " + yearToday + yearsel}>
					<span className="year-span">{lastYear}</span>
				</div>
			</div>
		);

	}
}