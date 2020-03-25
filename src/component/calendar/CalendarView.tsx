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
import { VelocityComponent } from "velocity-react";
import * as Immutable from "immutable";
import {createImmutableMap} from "../createImmutaleMap";
import {SvgIcon} from "../my-icon/index";
import {ICommonInterface,ICalendarStates } from "./calendar";

enum calendarType {
	year = 1,
	searson = 2,
	month = 3,
	day = 4,
}

type Props = {
	selTimeObj: ICommonInterface["showTimeObj"];
	showViewArr: ("fadeIn" | "fadeOut")[];
	viewIndex: 0 | 1;
	rotate:ICommonInterface["rotate"],
	curTime: ICommonInterface["curTime"];
	fixProps: ICommonInterface['fixProps'];
	changeBasicState:ICommonInterface["changeBasicState"];
};

type States = {
	showTimeObj: ICommonInterface["showTimeObj"];
	lastYear: number;
};

interface ICalendarView {
	changeSelTimeItme( viewIndex: number):void;

}
export default class CalendarView
	extends React.PureComponent<Props, States>
	implements ICalendarView {

	constructor(props:Props){
		super(props);
		const {selTimeObj,curTime} = this.props;
		const showTimeObj = this.getShowTimeObj(selTimeObj,curTime);
		this.state={
			showTimeObj,
			lastYear:this.getLastYear(showTimeObj.get("year")),
		};
	}
	getShowTimeObj(selTimeObj:ICommonInterface["showTimeObj"],curTime:ICommonInterface["curTime"]){
		return selTimeObj.getIn([0, "year"])
			? selTimeObj
			: createImmutableMap(curTime);
	}

	getLastYear(year:number){

		let viewIndex = year % 10;
		viewIndex = viewIndex === 0 ? 10 : viewIndex;
		const startTime = year - viewIndex + 1;
		return startTime + 9;
	}
	updatePanelYears(movePre: "next" | "back") {
		this.setState(pre => {

			let lastYear:number = pre.lastYear;
				lastYear =
				movePre === "back" ? lastYear - 10 : lastYear + 1;

			let index = lastYear % 10;
			index = index === 0 ? 10 : index;

			lastYear = lastYear - index + 10;

			return {
				lastYear,
			};
		});
	}
	changeSelTimeItme = (
		viewIndex: number,
	) => {
		const { year, month, day, searson } = this.state.showTimeObj.toJS();
		const { changeBasicState ,rotate} = this.props;
		changeBasicState<"selTimeArr">("selTimeArr",function(states:ICalendarStates) {

				let selTimeArr = states.selTimeArr;

				if (!selTimeArr.size) {
					selTimeArr = Immutable.fromJS([{ year: "" }]);
				}

				switch (rotate) {
					case calendarType.day:
						selTimeArr = selTimeArr.update(viewIndex, map => {
							return map.withMutations(node =>
								node
									.set("year", year)
									.set("month", month)
									.set("day", day)
									.set("searson", Math.ceil(month / 3))
							);
						});

						break;
					case calendarType.searson: {
						selTimeArr = selTimeArr.update(viewIndex, map => {
							return map.withMutations(node =>
								node
									.set("year", year)
									.set("month", searson * 3 - 2)
									.set("day", day)
									.set("searson", searson)
							);
						});

						break;
					}
					case calendarType.year: {
						selTimeArr = selTimeArr.update(viewIndex, map => {
							return map.withMutations(node =>
								node.set("year", year)
							);
						});
						break;
					}
					case calendarType.month: {
						selTimeArr = selTimeArr.update(viewIndex, map => {
							return map.withMutations(node =>
								node
									.set("year", year)
									.set("month", month)
									.set("searson", Math.ceil(month / 3))
							);
						});
						break;
					}
					default:
						selTimeArr = selTimeArr;
						break;
				}

				return selTimeArr;

		});

	}
	
	clickSelHandle = (e: React.MouseEvent<HTMLElement>) => {
		const dataset = e.currentTarget.dataset;
		const type = dataset.sign as "day" | "year" | "month" | "searson";
		const num = ~~dataset.num!;
		const { viewIndex,changeBasicState} = this.props;

		const flag = { [type]: num };
		const _showTimeobj = Object.assign(
			{},
			this.state.showTimeObj.toJS(),
			flag
		);
		
		//比较开始和结束的大小
		const startGtEnd = changeBasicState<"selTimeArr">("selTimeArr",(state)=>state.selTimeArr,{
			viewIndex,
			showTimeObj:_showTimeobj
		});

		if(startGtEnd){
			alert('开始时间要小于结束时间！');
			return ;	
		}

		this.setState(pre => {
			return {
				showTimeObj: pre.showTimeObj.set(type, num),
			};
		},()=>{
			const {rotate,showViewArr,changeBasicState} = this.props;
			this.changeSelTimeItme(viewIndex);
			//判断当前选的频率是不是和面板显示的频率一样
			const panelRotate = showViewArr.findIndex(val=>val==="fadeIn");
			if(rotate !== panelRotate){
				changeBasicState<"showViewArr">("showViewArr",function(){
					let animationArr:ICalendarStates["showViewArr"] = new Array(5).fill("fadeOut");
					 animationArr[rotate] = "fadeIn";
					return animationArr; 
				});
			}
		});
	}

	updatePanelDays(movePre: "next" | "back") {
		const { showTimeObj } = this.state;

		const year = showTimeObj.get("year"),
			month = showTimeObj.get("month");

		let updataMon= 1,
			updataYear = 1;

		switch (movePre) {
			case "back":
				updataMon= month - 1 === 0 ? 12 : month - 1;
				updataYear = month - 1 === 0 ? year - 1 : year;
				break;
			case "next":
				updataMon= month + 1 === 13 ? 1 : month + 1;
				updataYear = month + 1 === 13 ? year + 1 : year;
				break;
		}

		this.setState({
			showTimeObj: showTimeObj.withMutations((map:any) =>
				map
					.set("year", updataYear)
					.set("month",updataMon)
					.set("searson", Math.ceil(month / 3))
			),
		});
	}
	// 改变选择的面板
	changeView = (e: React.MouseEvent<HTMLSpanElement>) => {
		const type = e.currentTarget.dataset.sign as ("year" | "month" | "day");
		const {rotate} = this.props;

		this.props.changeBasicState<"showViewArr">("showViewArr",function(states){
			// 找出当前显示的面板频率
			const preIndex = states.showViewArr.findIndex(val => val === "fadeIn");

				let showViewArr = [...states.showViewArr];
				showViewArr[preIndex]= "fadeOut";

				if(preIndex === rotate){
					 showViewArr[calendarType[type]] ="fadeIn";
				}else{
					showViewArr[rotate]="fadeIn";
				}
			return showViewArr;
		});
	}

	changeRotate = (e: React.MouseEvent<HTMLElement>) => {
		const dom = e.currentTarget;
		if(dom.classList.contains("active")){
			return ;
		}

		const id = (+e.currentTarget!.dataset.id!) as ICommonInterface["rotate"];
		this.props.changeBasicState<"rotate">("rotate",function(){
			return id ;
		});	

	}
	controlBtnHandle = (e: React.MouseEvent<HTMLSpanElement>) => {
		const dataset = e.currentTarget.dataset;
		const type = dataset.sign as any;
		const curViewIndex = +dataset.curviewindex!;

		curViewIndex === calendarType.day
			? this.updatePanelDays(type)
			: this.updatePanelYears(type);
	}
	getRotateCombo(arr:string[]){
		const {rotate}  = this.props;
		return arr.map((val, index) => {
			const active = index === rotate - 1;
			const id = index + 1  ;
			return (
				<li
					className={(active && "active") || ""}
					data-id={id}
					onClick={this.changeRotate}
					key={index}>
					{val}
				</li>
			);
		});
	}
	getSelTime(){
		const {showTimeObj} = this.state;
		const {rotate} = this.props;
		if(rotate === calendarType.day){
			const year = showTimeObj.get("year");
			const month = `${showTimeObj.get("month")}`.padStart( 2, "0");
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
		}else if(rotate !== calendarType.year){
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
		}else{
			return undefined ;
		}
	}

	changeTime = (e: React.ChangeEvent<HTMLInputElement>) => {

		const name = e.currentTarget.name as 'hour' | 'minute' ;
		const viewIndex = +e.currentTarget.dataset.viewindex!;
		const {changeBasicState} = this.props;
		let value =  ~~e.currentTarget.value;
			value = name === "hour" ? (value>23 ? 23 : value) : (value > 59 ?59 :value);

		changeBasicState<"selTimeArr">("selTimeArr",function(states:ICalendarStates) {

				let selTimeArr = states.selTimeArr;

				if (!selTimeArr.size) {
					selTimeArr = Immutable.fromJS([{ year: "" }]);
				}

				selTimeArr = selTimeArr.update(viewIndex, map => {
					return map.withMutations(node =>{
						
						return node.set(name,value);
					});
				});

				return selTimeArr;

		});
		
	}
	render() {
		const {
			curTime,
			selTimeObj,
			viewIndex,
			fixProps:{noChangeRotate,time},
			rotate,
			showViewArr
		} = this.props;
		const { showTimeObj, lastYear} = this.state;
		console.log(showViewArr,"chld");
		

		const curViewInde = showViewArr.findIndex(val => val === "fadeIn");
		const showMoveBtn =
			curViewInde === calendarType.day ||
			curViewInde === calendarType.year;

		let duration = new Array(5).fill(0);

		duration[curViewInde] = 300;

		const arr = ["年", "季", "月","日"];
		const secondViewName = viewIndex === 1 ? "calendar-view2" :"";
		return (
			<div className={`${secondViewName } g-calendar-view`}>
				<div className="m-viewOpt">
					<div
						style={{ position: "relative",}}
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
							<i className="fa fa-backward" />
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
					<VelocityComponent
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
					</VelocityComponent>
					<VelocityComponent
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
					</VelocityComponent>
					<VelocityComponent
						animation={showViewArr[calendarType.month]}
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
						animation={showViewArr[calendarType.searson]}
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
