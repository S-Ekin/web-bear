/**
 * @name 天组件
 * @description description
 * @time 2019-10-22
 */
import * as React from "react";
import {ICommonInterface} from "./calendar";
interface ICalendarDayView {
	getTimePickCom():JSX.Element;
}

type Props = {
	curTime: ICommonInterface["curTime"];
	showTimeObj: ICommonInterface["showTimeObj"];
	selTimeObj: ICommonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
	time: boolean;
	changeTime: any;
	viewIndex: 0 | 1;
};
type States = {

};


// tslint:disable-next-line: variable-name
const DayComponent:React.SFC<{
		dayNum: number;
		disabled: boolean;
		showTimeObj: Props["showTimeObj"];
		curTime: Props["curTime"];
		selTimeObj: Props["showTimeObj"];
		clickSelHandle: Props["clickSelHandle"] | undefined;
	}> = ({ dayNum, disabled, showTimeObj, selTimeObj, curTime, clickSelHandle }) => {


		const year = showTimeObj.get("year"),
			month = showTimeObj.get("month");


		const selYear = selTimeObj.get("year"),
			selMon = selTimeObj.get("month"),
			selDay = selTimeObj.get("day");

		const isAble = !disabled ? " view-item " : "day-disabled";

		const isToday = (!disabled && year === curTime.year && month === curTime.month && curTime.day === dayNum) && "calendar-today" || "";

		const isSel = (!disabled && year === selYear && month === selMon && dayNum === selDay) && "calendar-sel" || "";

		return (
			<li
				className={isAble + " " + isToday + " " + isSel}
				data-sign="day"
				data-num={dayNum}
				onClick={(!isSel && clickSelHandle) || undefined}>
				<span className="day-span">{dayNum}</span>
			</li>
		);

	};
export default class CalendarDayView extends React.PureComponent<Props, States> 
implements ICalendarDayView{

	getTimePickCom(){

		const {selTimeObj, changeTime, viewIndex} = this.props;
		const hour = selTimeObj.get("hour"),
			minute = selTimeObj.get("minute");
		return (
			<div className="m-time">
				<div>
					<b>时间：&nbsp;</b>
					<input
						type="number"
						className="wacth-time"
						data-viewindex={viewIndex}
						max="24"
						min="0"
						value={hour}
						name="hour"
						onChange={changeTime}
					/>
				</div>
				<div>
					<b>&nbsp;&nbsp;:&nbsp;</b>
					<input
						type="number"
						className="wacth-time"
						max="59"
						data-viewindex={viewIndex}
						min="0"
						name="minute"
						value={minute}
						onChange={changeTime}
					/>
				</div>
			</div>
		);

	}

	getDayArr(){

		const { showTimeObj, curTime, selTimeObj, clickSelHandle} = this.props;

		const year = showTimeObj.get("year"),
			month = showTimeObj.get("month");

		const days = this.getMonDays(year, month);

		const monFirstDayToWeek = (new Date(year, month - 1, 1)).getDay(); //看当前这个月的第一天是星期几

		const dayArrleg = Math.ceil((days + monFirstDayToWeek) / 7); // 一共包含几个星期在内


		const daysArr = new Array(dayArrleg).fill("1").map((...args) => {

			const [, index] = args;

			switch (index) {

				case 0: {  // 日历的第一行，有可能包含上个月的

					const preMonDays = this.getMonDays(year, month - 1); //上一个月的

					const preMonDayArr = Array.from({ length: monFirstDayToWeek }, (...args) => args[1] + 1).map(val => {

						const day = preMonDays - monFirstDayToWeek + val;

						return (
						<DayComponent
							key={day}
							dayNum={day}
							disabled={true}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={undefined}
						/>
						);
					});


					const firstArr = Array.from({ length: 7 - monFirstDayToWeek }, (...args) => args[1] + 1).map(val => {
						return (
							<DayComponent
								dayNum={val}
								key={val}
								disabled={false}
								curTime={curTime}
								selTimeObj={selTimeObj}
								showTimeObj={showTimeObj}
								clickSelHandle={clickSelHandle}
							/>
						);
					});

					return (
					<ul className="data-group" key={index}>
						{preMonDayArr.concat(firstArr)}
					</ul>
					);
				}

				case dayArrleg - 1: {//最后一排，可能包含下个月的日期

					const startDayNum = 7 * index - monFirstDayToWeek;

					const count = (days + monFirstDayToWeek) % 7 || 7;

					const lastArr = Array.from({ length: count }, (...args) => args[1] + 1).map(val => {
						const day = val + startDayNum;
						return (
							<DayComponent
								dayNum={day}
								disabled={false}
								curTime={curTime}
								selTimeObj={selTimeObj}
								showTimeObj={showTimeObj}
								key={day}
								clickSelHandle={clickSelHandle}
							/>
						);
					});

					const lastMonDays = Array.from({ length: 7 - count }, (...args) => args[1] + 1).map((val) => {
						return (
						<DayComponent
							dayNum={val}
							disabled={true}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							key={val}
							clickSelHandle={undefined}
						/>
						);
					});


					return (
					<ul className="data-group" key={index}>
						{lastArr.concat(lastMonDays)}
					</ul>
					);

				}
				default: {

					const startDayNum = 7 * index - monFirstDayToWeek;

					const monDayArr = Array.from({ length: 7 }, (...args) => args[1] + 1).map((val) => {
						const day = val + startDayNum;
						return (
						<DayComponent
							dayNum={day}
							key={day}
							disabled={false}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={clickSelHandle}

						/>
						);
					});

					return (
					<ul className="data-group" key={index}>
						{monDayArr}
					</ul>
					);

				}

			}

		});

		return daysArr ;

	}
	getMonDays(year: number, mon: number) {
		const day = new Date(year, mon, 0);
		return day.getDate();
	}

	
	render() {


		const {time} = this.props;
		const timeCom = time ? this.getTimePickCom() : undefined;
		return (
			<div className="m-dayView item-calendar-view">
				<ul className="week-group">
					<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>
				</ul>
				{this.getDayArr()}
				{timeCom}
			</div>
		);

	}
}

