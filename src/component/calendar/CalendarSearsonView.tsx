import * as React from "react";


type commonInterface = CalendarSpace.commonInterface;


type CalendarSearsonViewProp = {
	curTime: commonInterface["curTime"];
	showTimeObj: commonInterface["showTimeObj"];
	selTimeObj: commonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
}

type CalendarSearsonViewState = {



}


interface CalendarSearsonViewApi {

}



export default class CalendarSearsonView extends React.PureComponent<CalendarSearsonViewProp, CalendarSearsonViewState> implements CalendarSearsonViewApi {

	static searsonFormatter = ["", "一季度", "二季度", "三季度", "四季度"];

	render() {


		const { curTime: { year, month }, selTimeObj, clickSelHandle, showTimeObj } = this.props;

		const selYear = selTimeObj.get("year");
		const selSearson = selTimeObj.get("searson");

		const showYear = showTimeObj.get("year");

		let startSearson = 0;

		const searson_today = year === showYear;
		const searson_sel = selYear === year;

		return (<div className="m-searsonView item-calendar-view">
			{
				Array.from({ length: 2 }, (...args) => (args[1] + 1)).map(row => {


					return (

						<ul className="searson-group" key={row}>
							{
								Array.from({ length: 2 }, (...args) => (args[1] + 1)).map(() => {

									const num = ++startSearson;

									const searsonToday = searson_today && month === num && "calendar-today" || "";
									const searsonSel = searson_sel && selSearson === num && "calendar-sel" || "";

									return (<li data-num={num} key={num} data-sign="searson" className={"view-item " + searsonToday + " " + searsonSel} onClick={!searsonSel &&  clickSelHandle || undefined}>
										<span className="searson-span">{CalendarSearsonView.searsonFormatter[num]}</span>
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