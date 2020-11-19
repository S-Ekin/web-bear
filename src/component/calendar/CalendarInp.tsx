/**
 * @name 日历输入框
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import {VelocityComponent} from "velocity-react";
import * as Immutable from "immutable";
import {SvgIcon} from "../my-icon/index";
import {ICommonInterface,ICalendarStates} from "./calendar";
type Props={
    inpVal: string;
	placeholder: string;
	curTime: ICommonInterface["curTime"];
	style: 1 | 2;
	ableClear?: boolean;
	changeBasicState:ICommonInterface["changeBasicState"]
};
type States={

};

interface ICalendarInp {
	clearValue(e: React.MouseEvent<HTMLElement>):void;
	toggleDrop():void;
}

class CalendarInp extends React.PureComponent<
	Props,
	States
> implements ICalendarInp{
	state = {};

	clearValue = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		const {changeBasicState,style,curTime} = this.props;
		changeBasicState<"selTimeArr">("selTimeArr",function(_state:ICalendarStates) {
			const {hour,minute,month,searson } = curTime;
			const initArr = Array.from({ length: style}).map(() => {
					return {
						year: "",
						month,
						searson,
						day: 1,
						hour,
						minute,
					};
				});
			return Immutable.fromJS(initArr);
		});
	}
	toggleDrop=()=>{
		const {changeBasicState} = this.props;
		changeBasicState<"expand">("expand",function(state:ICalendarStates) {
			return !state.expand;
		});
	}
	render() {
		const { inpVal, placeholder, ableClear } = this.props;

		const closeIcon = ableClear ? (
					<VelocityComponent
						animation={inpVal ? "fadeIn" : "fadeOut"}>
						<span
							className="m-search-close"
							onClick={this.clearValue}>
							<SvgIcon className="close"/>
						</span>
					</VelocityComponent>
				) : undefined ;
		return (
			<div className="m-clalendar-inpBox" onClick={this.toggleDrop}>
				<span className="calendar-inp-icon">
					<SvgIcon className="calendar"/>
				</span>
				<input
					className="s-inp calendar-inpTxt"
					value={inpVal}
					placeholder={placeholder}
					readOnly={true}
					type="text"
				/>
				{closeIcon}
			</div>
		);
	}
}

export default CalendarInp;