import * as React from "react";

type commonInterface = CalendarSpace.commonInterface;


type DayViewProp = {
	curTime: commonInterface["curTime"];
	showTimeObj: commonInterface["showTimeObj"];
	selTimeObj: commonInterface["showTimeObj"];
	clickSelHandle: (e: React.MouseEvent<HTMLElement>) => void;
	time: boolean;
	changeTime: CalendarSpace.CalendarApi["changeTime"];
	viewIndex: 0 | 1;
};
type DayViewState = {

};





export default class CalendarDayView extends React.PureComponent<DayViewProp, DayViewState>{

	static DayComponent: React.SFC<{
		dayNum: number;
		disabled: boolean;
		showTimeObj: DayViewProp["showTimeObj"];
		curTime: DayViewProp["curTime"];
		selTimeObj: DayViewProp["showTimeObj"];
		clickSelHandle: DayViewProp["clickSelHandle"] | undefined;
	}> = ({ dayNum, disabled, showTimeObj, selTimeObj, curTime, clickSelHandle }) => {


		const year = showTimeObj.get("year"),
			month = showTimeObj.get("month");


		const sel_year = selTimeObj.get("year"),
			sel_mon = selTimeObj.get("month"),
			sel_day = selTimeObj.get("day");

		const is_able = !disabled ? " view-item " : "day-disabled";

		const is_Today = (!disabled && year === curTime.year && month === curTime.month && curTime.day === dayNum) && "calendar-today" || "";

		const is_sel = (!disabled && year === sel_year && month === sel_mon && dayNum === sel_day) && "calendar-sel" || "";

		return (<li className={is_able + " " + is_Today + " " + is_sel} data-sign="day" data-num={dayNum} onClick={!is_sel && clickSelHandle || undefined}>
			<span className="day-span" >{dayNum}</span>
		</li>)

	}

	static TimePick: React.SFC<{
		selTimeObj: DayViewProp["showTimeObj"];
		changeTime: CalendarSpace.CalendarApi["changeTime"];
		viewIndex: 0 | 1;
	}> = ({ selTimeObj, changeTime, viewIndex }) => {
		const hour = selTimeObj.get("hour"),
			minute = selTimeObj.get("minute");

		return (<div className="m-time">
			<div>
				<b>时间：&nbsp;</b>
				<input type="number" className="wacth-time" data-viewindex={viewIndex} max="24" min="0" value={hour} name="hour" onChange={changeTime} />
			</div>
			<div>
				<b>&nbsp;&nbsp;:&nbsp;</b>
				<input type="number" className="wacth-time" max="60" data-viewindex={viewIndex} min="0" name="minute" value={minute} onChange={changeTime} />
			</div>
		</div>)

	}


	getMonDays(year: number, mon: number) {
		const day = new Date(year, mon, 0);
		return day.getDate();
	}


	render() {


		const { showTimeObj, curTime, selTimeObj, clickSelHandle, time, changeTime, viewIndex } = this.props;

		const year = showTimeObj.get("year"),
			month = showTimeObj.get("month");

		const days = this.getMonDays(year, month);

		const MonFirstDayToWeek = (new Date(year, month - 1, 1)).getDay(); //看当前这个月的第一天是星期几

		const dayArrleg = Math.ceil((days + MonFirstDayToWeek) / 7); // 一共包含几个星期再内


		const daysArr = new Array(dayArrleg).fill("1").map((...args) => {

			const [, index] = args;

			switch (index) {

				case 0: {  // 日历的第一行，有可能包含上个月的

					const preMonDays = this.getMonDays(year, month - 1); //上一个月的

					const preMonDayArr = Array.from({ length: MonFirstDayToWeek }, (...args) => args[1] + 1).map(val => {

						const day = preMonDays - MonFirstDayToWeek + val;

						return <CalendarDayView.DayComponent
							key={day}
							dayNum={day}
							disabled={true}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={undefined}
						/>;
					});


					const firstArr = Array.from({ length: 7 - MonFirstDayToWeek }, (...args) => args[1] + 1).map(val => {
						return <CalendarDayView.DayComponent
							dayNum={val}
							key={val}
							disabled={false}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={clickSelHandle}
						/>;
					});

					return (<ul className="data-group" key={index}>
						{
							preMonDayArr.concat(firstArr)
						}
					</ul>)
				}

				case dayArrleg - 1: {//最后一排，可能包含下个月的日期

					const startDayNum = 7 * index - MonFirstDayToWeek;

					const count = (days + MonFirstDayToWeek) % 7 || 7;

					const lastArr = Array.from({ length: count }, (...args) => args[1] + 1).map(val => {
						const day = val + startDayNum;
						return <CalendarDayView.DayComponent
							dayNum={day}
							disabled={false}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							key={day}
							clickSelHandle={clickSelHandle}
						/>;
					});

					const lastMonDays = Array.from({ length: 7 - count }, (...args) => args[1] + 1).map((val) => {
						return <CalendarDayView.DayComponent
							dayNum={val}
							disabled={true}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							key={val}
							clickSelHandle={undefined}
						/>;
					});


					return (<ul className="data-group" key={index}>
						{
							lastArr.concat(lastMonDays)
						}
					</ul>)

				}
				default: {

					const startDayNum = 7 * index - MonFirstDayToWeek;

					const MonDayArr = Array.from({ length: 7 }, (...args) => args[1] + 1).map((val) => {
						const day = val + startDayNum;
						return <CalendarDayView.DayComponent
							dayNum={day}
							key={day}
							disabled={false}
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={clickSelHandle}

						/>;
					});

					return (<ul className="data-group" key={index}>
						{
							MonDayArr
						}
					</ul>)

				}

			}

		});



		//	this.time && daysArr.push(this.renderTimeBox()) ;	
		return (
			<div className="m-dayView item-calendar-view">
				<ul className="week-group">
					<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>
				</ul>
				{
					daysArr
				}{

					time ? <CalendarDayView.TimePick
						selTimeObj={selTimeObj}
						changeTime={changeTime}
						viewIndex={viewIndex}

					/> : null
				}

			</div>
		)

	}
};

