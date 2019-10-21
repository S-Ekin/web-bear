import * as React from "react";
import CalendarDayView from "./CalendarDayView";
import CalendarYearView from "./CalendarYearView";
import CalendarMonthView from "./CalendarMonthView";
import CalendarSearsonView from "./CalendarSearsonView";
import { VelocityComponent } from "velocity-react";
import * as Immutable from "immutable";

enum calendarType {
	year = 1,
	searson = 2,
	month = 3,
	day = 4,
}

type commonInterface = CalendarSpace.commonInterface;
type CalendarApi = CalendarSpace.CalendarApi;
type CalendarViewApi = CalendarSpace.CalendarViewApi;

type calendarViewProps = {
	rotate: commonInterface["rotate"];
	selTimeObj: commonInterface["showTimeObj"];
	showTimeObj: commonInterface["showTimeObj"];
	curTime: commonInterface["curTime"];
	changeSelTimeItme: CalendarApi["changeSelTimeItme"];
	viewIndex: 0 | 1;
	time: boolean;
	changeTime: CalendarSpace.CalendarApi["changeTime"];
	nochangeRotate?: boolean;
	noDay?: boolean;
	changeRotate(rotate: commonInterface["rotate"]): void;
};

type calendarViewState = {
	showTimeObj: calendarViewProps["selTimeObj"];
	showViewArr: Immutable.List<"fadeIn" | "fadeOut">;
	lastYear: number;
	dropRatate: boolean;
};

export default class CalendarView
	extends React.PureComponent<calendarViewProps, calendarViewState>
	implements CalendarViewApi {
	state: calendarViewState = {
		showTimeObj: this.props.showTimeObj,
		dropRatate: false,
		showViewArr: (function(rotate) {
			let animationArr = new Array(5).fill("fadeOut");
			animationArr[rotate] = "fadeIn";
			return Immutable.List(animationArr);
		})(this.props.rotate),
		lastYear: (function(year) {
			let viewIndex = year % 10;
			viewIndex = viewIndex === 0 ? 10 : viewIndex;

			const startTime = year - viewIndex + 1;
			return startTime + 9;
		})(this.props.showTimeObj.get("year")),
	};

	updateYears(movePre: "next" | "back") {
		this.setState(pre => {
			let lastYear =
				movePre === "back" ? pre.lastYear - 10 : pre.lastYear + 1;

			let index = lastYear % 10;
			index = index === 0 ? 10 : index;

			lastYear = lastYear - index + 10;

			return {
				lastYear,
			};
		});
	}

	clickSelHandle = (e: React.MouseEvent<HTMLElement>) => {
		const dataset = e.currentTarget.dataset;
		const type = dataset.sign as "day" | "year" | "month" | "searson";
		const num = ~~dataset.num!;
		const { viewIndex, changeSelTimeItme, rotate } = this.props;

		const flag = { [type]: num };

		this.setState(pre => {
			return {
				showTimeObj: pre.showTimeObj.set(type, num),
			};
		});

		const _showTimeobj = Object.assign(
			{},
			this.state.showTimeObj.toJS(),
			flag
		);

		changeSelTimeItme(viewIndex, _showTimeobj);

		const { showViewArr } = this.state;

		const curShowIndex = showViewArr.findIndex(val => val === "fadeIn");

		if (
			curShowIndex === calendarType.year ||
			curShowIndex === calendarType.month
		) {
			this.setState({
				showViewArr: showViewArr
					.set(curShowIndex, "fadeOut")
					.set(rotate, "fadeIn"),
			});
		}
	}

	componentWillReceiveProps(nextProps: calendarViewProps) {
		if (nextProps.rotate !== this.props.rotate) {
			let animationArr = new Array(5).fill("fadeOut");
			animationArr[nextProps.rotate] = "fadeIn";
			this.setState({
				showViewArr: Immutable.List(animationArr),
			});
		}
	}

	updateDaysView(movePre: "next" | "back") {
		const { showTimeObj } = this.state;

		const year = showTimeObj.get("year"),
			month = showTimeObj.get("month");

		let updata_mon = 1,
			updata_year = 1;

		switch (movePre) {
			case "back":
				updata_mon = month - 1 == 0 ? 12 : month - 1;
				updata_year = month - 1 == 0 ? year - 1 : year;
				break;
			case "next":
				updata_mon = month + 1 == 13 ? 1 : month + 1;
				updata_year = month + 1 == 13 ? year + 1 : year;
				break;
		}

		this.setState({
			showTimeObj: showTimeObj.withMutations((map:any) =>
				map
					.set("year", updata_year)
					.set("month", updata_mon)
					.set("searson", Math.ceil(month / 3))
			),
		});
	}

	changeView = (e: React.MouseEvent<HTMLSpanElement>) => {
		const type = e.currentTarget.dataset.sign as ("year" | "month");

		this.setState(pre => {
			const preIndex = pre.showViewArr.findIndex(val => val === "fadeIn");
			const showViewArr = pre.showViewArr
				.set(preIndex, "fadeOut")
				.set(calendarType[type], "fadeIn");
			return {
				showViewArr,
			};
		});
	}
	toggleRotate = () => {
		this.setState(pre => ({
			dropRatate: !pre.dropRatate,
		}));
	}

	changeRotate = (e: React.MouseEvent<HTMLElement>) => {
		const id = +e.currentTarget!.dataset.id! as commonInterface["rotate"];

		this.props.changeRotate(id);

		this.setState({
			dropRatate: false,
		});
	}
	controlBtnHandle = (e: React.MouseEvent<HTMLSpanElement>) => {
		const dataset = e.currentTarget.dataset;
		const type = dataset.sign as any;
		const curViewIndex = +dataset.curviewindex!;

		curViewIndex === calendarType.day
			? this.updateDaysView(type)
			: this.updateYears(type);
	}

	render() {
		const {
			curTime,
			selTimeObj,
			rotate,
			time,
			changeTime,
			viewIndex,
			nochangeRotate,
			noDay,
		} = this.props;
		const { showTimeObj, showViewArr, lastYear } = this.state;

		const curViewInde = showViewArr.findIndex(val => val === "fadeIn");
		const showMoveBtn =
			curViewInde === calendarType.day ||
			curViewInde === calendarType.year;

		let duration = new Array(5).fill(0);

		duration[curViewInde] = 300;

		const arr = ["年", "季", "月","日"];
		if(noDay){
			arr.pop();

		}
		return (
			<div className="g-calendar-view">
				<div className="m-viewOpt">
					<div
						style={{ position: "relative",}}
						className={nochangeRotate ? "" : "can-hover"}>
						<span className="curViewType ">
							{arr[curViewInde - 1]}
						</span>
						<ul className="m-rotate-drop">
							{arr.map((val, index) => {
								const active = index === rotate - 1;
								return (
									<li
										className={(active && "active") || ""}
										data-id={index + 1 + ""}
										onClick={
											!active
												? this.changeRotate
												: undefined
										}
										key={index}>
										{val}
									</li>
								);
							})}
						</ul>
					</div>
					<div className="m-timeSel">
						{rotate === calendarType.day ? (
							<div>
								<i className="fa fa-calendar" />
								&nbsp;
								<span
									data-sign="year"
									onClick={this.changeView}>
									{showTimeObj.get("year")}/
								</span>
								<span
									data-sign="month"
									onClick={this.changeView}>
									{(showTimeObj.get("month") + "").padStart(
										2,
										"0"
									)}
								</span>
							</div>
						) : rotate !== calendarType.year ? (
							<div>
								<i className="fa fa-calendar" />
								&nbsp;
								<span
									data-sign="year"
									onClick={this.changeView}>
									{showTimeObj.get("year")}年
								</span>
							</div>
						) : null}
					</div>
					<div
						className={
							"m-moveBtns " + (showMoveBtn ? "" : "hideMoveBtn")
						}>
						<button
							className="s-btn"
							onClick={this.controlBtnHandle}
							data-sign="back"
							data-curviewindex={curViewInde}>
							<i className="fa fa-backward" />
						</button>
						<button
							className="s-btn"
							onClick={this.controlBtnHandle}
							data-sign="next"
							data-curviewindex={curViewInde}>
							<i className="fa fa-forward" />
						</button>
					</div>
				</div>
				<div className="m-calendar-view">
					<VelocityComponent
						animation={showViewArr.get(calendarType.day)!}
						duration={duration[calendarType.day]}>
						<CalendarDayView
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={this.clickSelHandle}
							time={time}
							changeTime={changeTime}
							viewIndex={viewIndex}
						/>
					</VelocityComponent>
					<VelocityComponent
						animation={showViewArr.get(calendarType.year)!}
						duration={duration[calendarType.year]}>
						<CalendarYearView
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={this.clickSelHandle}
							rotate={rotate}
							lastYear={lastYear}
						/>
					</VelocityComponent>
					<VelocityComponent
						animation={showViewArr.get(calendarType.month)!}
						duration={duration[calendarType.month]}>
						<CalendarMonthView
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={this.clickSelHandle}
							rotate={rotate}
						/>
					</VelocityComponent>
					<VelocityComponent
						animation={showViewArr.get(calendarType.searson)!}
						duration={duration[calendarType.searson]}>
						<CalendarSearsonView
							curTime={curTime}
							selTimeObj={selTimeObj}
							showTimeObj={showTimeObj}
							clickSelHandle={this.clickSelHandle}
						/>
					</VelocityComponent>
				</div>
			</div>
		);
	}
}
