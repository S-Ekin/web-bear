import * as React from "react";


type commonInterface = CalendarSpace.commonInterface;


type CalendarYearViewProp = {
	curTime: commonInterface["curTime"];
	showTimeObj: commonInterface["showTimeObj"];
	selTimeObj: commonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
	rotate: commonInterface["rotate"];
	lastYear: number;
}

type CalendarYearViewState = {



}


interface CalendarYearViewApi {

}



export default class CalendarYearView extends React.PureComponent<CalendarYearViewProp, CalendarYearViewState> implements CalendarYearViewApi {



	render() {



		const { curTime: { year }, selTimeObj, clickSelHandle, lastYear } = this.props;
		const selYear = selTimeObj.get("year");

		let startTime = lastYear - 10;

		const yearToday = year === lastYear && "calendar-today" || "";
		const yearsel = selYear === lastYear && "calendar-sel" || "";

		return (<div className="m-yearView item-calendar-view">
			{
				Array.from({ length: 3 }, (...args) => (args[1] + 1)).map(row => {


					return (

						<ul className="year-group" key={row} >
							{
								Array.from({ length: 3 }, (...args) => (args[1] + 1)).map(() => {

									const num = ++startTime;

									const yearToday = year === num && "calendar-today" || "";
									const yearsel = selYear === num && "calendar-sel" || "";

									return (<li data-num={num} key={num} data-sign="year" className={"view-item " + yearToday + " " + yearsel} onClick={!yearsel && clickSelHandle || undefined}>
										<span className="year-span">{num}</span>
									</li>)
								})
							}

						</ul>
					)
				})
			}
			<div data-num={lastYear} data-sign="year" onClick={clickSelHandle} className={"last-year view-item " + yearToday + yearsel}>
				<span className="year-span">{lastYear}</span>
			</div>
		</div>)

	}
}