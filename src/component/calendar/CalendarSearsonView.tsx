/**
 * @name name
 * @description description
 * @time 2019-10-22
 */
import * as React from "react";
import {ICommonInterface} from "./calendar";
interface ICalendarSearsonView {
getSeasonItemArr():JSX.Element[];
}

type Props = {
	curTime: ICommonInterface["curTime"];
	showTimeObj: ICommonInterface["showTimeObj"];
	selTimeObj: ICommonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
};

type CalendarSearsonViewState = {


};

const searsonFormatter = ["", "一季度", "二季度", "三季度", "四季度"];
export default class CalendarSearsonView
	extends React.PureComponent<Props, CalendarSearsonViewState>
	implements ICalendarSearsonView {

	getSeasonItemArr(){
		const {
			curTime: { year, month },
			selTimeObj,
			clickSelHandle,
			showTimeObj,
		} = this.props;

		const selYear = selTimeObj.get("year");
		const selSearson = selTimeObj.get("searson");

		const showYear = showTimeObj.get("year");

		let startSearson = 0;

		const isSearsonToday = year === showYear;
		const isSearsonSel = selYear === showYear;

		return Array.from({ length: 2 }, (...args) => args[1] + 1).map( row => {

			const item = Array.from(
						{ length: 2 },
						(...args) => args[1] + 1
					).map(() => {
						const num = ++startSearson;

						const searsonToday = (isSearsonToday && month === num && "calendar-today") || "";
							const searsonSel = (isSearsonSel && selSearson === num && "calendar-sel") || "";
							const className = 	"view-item " + searsonToday + " " + searsonSel;
						return (
							<li
								data-num={num}
								key={num}
								data-sign="searson"
								className={className}
								onClick={(!searsonSel && clickSelHandle) || undefined}>
								<span className="searson-span">
									{searsonFormatter[num]}
								</span>
							</li>
						);
					});
			return (
				<ul className="searson-group" key={row}>
					{item}
				</ul>
			);
					}
				);
	}
	render() {
		

		return (
			<div className="m-searsonView item-calendar-view">
				{this.getSeasonItemArr()}
			</div>
		);
	}
}