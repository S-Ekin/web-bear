/**
 * @name 日历输入框
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import { Animate } from "../animate/index";
import * as Immutable from "immutable";
import {SvgIcon} from "../my-icon/index";
import {ICommonInterface,ICalendarStates} from "./calendar";
import { slideOther} from "../util/autoSlideUp";
type Props={
    inpVal: string;
	placeholder: string;
	eventId:string;
	curTime: ICommonInterface["curTime"];
	style: 1 | 2;
	ableClear?: boolean;
	disabled?: boolean;
	changeBasicState:ICommonInterface["changeBasicState"]
};
type States={

};

interface ICalendarInp {
	clearValue(e: React.MouseEvent<HTMLElement>):void;
	toggleDrop(e:React.MouseEvent<HTMLDivElement>):void;
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
	toggleDrop=(e:React.MouseEvent<HTMLDivElement>)=>{
		const {changeBasicState,eventId} = this.props;
		slideOther(e.nativeEvent,eventId);
		changeBasicState<"expand">("expand",function(state:ICalendarStates) {
			return !state.expand;
		});
	}
	render() {
		const { inpVal, placeholder, ableClear, disabled } = this.props;

		const closeIcon = ableClear && !disabled ? (
					<Animate
						spanWrapEle={true}
						animation={inpVal ? "fadeIn" : "fadeOut"}>
						<span
							className="m-search-close"
							onClick={this.clearValue}>
							<SvgIcon className="close"/>
						</span>
					</Animate>
				) : undefined ;

		return (
			<div className={`m-clalendar-inpBox ${disabled ? "disabled": ""}`} onClick={disabled ? undefined : this.toggleDrop}>

				<input
					className="s-inp calendar-inpTxt"
					value={inpVal}
					disabled={disabled}
					placeholder={placeholder}
					readOnly={true}
					type="text"
				/>	
				{closeIcon}
				<span className="calendar-inp-icon">
					<SvgIcon className="calendar"/>
				</span>
			</div>
		);
	}
}

export default CalendarInp;