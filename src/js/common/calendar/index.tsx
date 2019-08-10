import * as React from "react";
//import "@css/common/Calendar.scss";
import { VelocityComponent } from "velocity-react";
import * as  Immutable from "immutable";
import CalendarView from "./CalendarView";


type commonInterface = CalendarSpace.commonInterface;
type CalendarApi = CalendarSpace.CalendarApi;

enum calendarType {
	year = 1,
	searson = 2,
	month = 3,
	day = 4,
}


type calendarInpProps = {
	selTimeVal: string;
	placeholder: string;
	dropHandle(): void;
	ableClear?:boolean;
	clearTime():void;
}

type calendarInpState = {


}



class CalendarInp extends React.PureComponent<calendarInpProps, calendarInpState>{
	state={
	}

	clearValue=(e:React.MouseEvent<HTMLElement>)=>{
		e.stopPropagation();
	
		this.props.clearTime();
	}
	render() {
		const { selTimeVal, dropHandle, placeholder,ableClear } = this.props;


		return (
			<div className="m-clalendar-inpBox" onClick={dropHandle}>
				<span className="calendar-inp-icon"><i className="fa fa-calendar">&nbsp;</i></span>
				<input className="s-inp calendar-inpTxt" value={selTimeVal} placeholder={placeholder} readOnly type="text" />
				{ableClear ? <VelocityComponent animation={selTimeVal ? "fadeIn" :"fadeOut"}>
						<span className="m-search-close" onClick={this.clearValue} ><i className="fa fa-times fa-lg"></i></span>
				</VelocityComponent>:null}
			
			</div>
		)

	}
}




type calendarProps = {
	rotate?: commonInterface["rotate"], // 日历类型
	style?: 1 | 2,
	time?: boolean, //可选择时间
	hasInp?: boolean,
	selTimeValArr?: string;//最终显示的时间字符串
	width?: number;
	clickBack?: (timeObj:any[], field: string,rotate:calendarProps["rotate"]) => void;
	field: string;
	placeholder?: string;
	ableClear?:boolean;
	noChangeRotate?:boolean;
	init?:boolean;
	initCallback?:boolean;
}

type calendarState = {
	expand: boolean;
	selTimeArr: Immutable.List<TypedMap<CalendarApi["curTime"]>>;
	rotate: commonInterface["rotate"],
	calendarVal:string;
	
}


class Calendar extends React.PureComponent<calendarProps, calendarState> implements CalendarApi {

	static defaultProps = {
		//rotate: calendarType.day,
		rotate: window.sys_defaultTime.rotate,
		style: 1,
		time: false,
		hasInp: true,
		//selTimeValArr:"",
		selTimeValArr:window.sys_defaultTime.time,
		width: 240,
		placeholder: "",
		ableClear:false,
		initCallback:true,
	}



	curTime = this.getCurTime();

	
	wrapDomRef:React.RefObject<HTMLDivElement> = React.createRef();
	constructor(props:calendarProps){

		super(props);
		const {time,rotate,clickBack,field,ableClear,initCallback} = this.props;
		const selTimeArr = Immutable.fromJS(this.timeValToTimeObj(ableClear!,this.props));
		
		const timeVal = this.getTimeStrArr(selTimeArr,rotate!,time!);
		this.state={
		expand: false,
		selTimeArr,
		rotate:rotate!,
		calendarVal:timeVal.join(" 至 ")
	};
 
	  //!selTimeValArr && !ableClear && clickBack && clickBack(timeVal.toJS(),field,rotate);

	  initCallback && clickBack && clickBack(timeVal.toJS(),field,rotate);

	}
	componentWillReceiveProps(nextProps:calendarProps){
		if(nextProps.init !=  this.props.init|| nextProps.selTimeValArr!=this.props.selTimeValArr ||　nextProps.rotate!=this.props.rotate){

			const {time,rotate,clickBack,field,ableClear,initCallback} = nextProps;
			const selTimeArr = Immutable.fromJS(this.timeValToTimeObj(ableClear!,nextProps));
			
			const timeVal = this.getTimeStrArr(selTimeArr,rotate!,time!);
			this.setState({
				expand: false,
				selTimeArr,
				rotate:rotate!,
				calendarVal:timeVal.join(" 至 ")

        });
 
	  initCallback && clickBack && clickBack(timeVal.toJS(),field,rotate);
	  //!selTimeValArr && !ableClear && clickBack && clickBack(timeVal.toJS(),field,rotate);

		}
	}
	documentClickFn=(e:MouseEvent)=>{

		const target = e.target! as HTMLElement;
		const wrap = this.wrapDomRef.current!;
		if(target == wrap || wrap.contains(target) ){
			
		}else{

			this.setState({
				expand:false
			});
		}


		

	}

	componentDidMount(){

		document.addEventListener("click",this.documentClickFn);
	}
	componentWillUnmount(){

		document.removeEventListener("click",this.documentClickFn);
	}
	//改变时间日期
	changeSelTimeItme = (viewIndex: number, showTimeObj: CalendarApi["curTime"]) => {
		const { year, month, day, searson } = showTimeObj;
		const { rotate } = this.state;
		this.setState(pre => {

			let selTimeArr = pre.selTimeArr;

			if(!selTimeArr.size){
				selTimeArr = Immutable.fromJS([{year:""}])
			}

			switch (rotate) {
				case calendarType.day:


					selTimeArr = selTimeArr.update(viewIndex, map => {
						return map.withMutations(node => node.set("year", year).set("month", month).set("day", day).set("searson", Math.ceil(month / 3)))
					});


					break;
				case calendarType.searson: {

					selTimeArr = selTimeArr.update(viewIndex, map => {
						return map.withMutations(node => node.set("year", year).set("month", searson * 3 - 2).set("day", day).set("searson", searson))
					});


					break;
				}
				case calendarType.year: {
					selTimeArr = selTimeArr.update(viewIndex, map => {
						return map.withMutations(node => node.set("year", year))
					});
					break;
				}
				case calendarType.month: {

					selTimeArr = selTimeArr.update(viewIndex, map => {
						return map.withMutations(node => node.set("year", year).set("month", month).set("searson", Math.ceil(month / 3)))
					});
					break;
				}
				default:
					selTimeArr = selTimeArr;
					break;
			}




			return {
				selTimeArr,
			}
		},()=>{
			this.getSelTimeVal();
		});

	}

	//清除所选的时间
	clearSelTime=()=>{
		
		this.setState({
			selTimeArr:Immutable.fromJS(this.timeValToTimeObj(true,this.props)),
			expand:false
		},()=>{
			this.getSelTimeVal();
		})

	}

	changeRotate=(rotate:commonInterface["rotate"])=>{

		this.setState({
			rotate:rotate
		},()=>{
			this.getSelTimeVal();
		})
	}

	getCurTime() {
		const time = new Date();
		const year = time.getFullYear();
		const month = time.getMonth() + 1;
		const day = time.getDate();
		const searson = Math.ceil(month / 3);
		const hour = time.getHours();
		const minute = time.getMinutes();

		return { year, searson, month, day, hour, minute }

	}
	// 改变时间点
	changeTime = (e: React.ChangeEvent<HTMLInputElement>) => {

		const value = +e.currentTarget.value,
			field = e.currentTarget.name,
			viewIndex = +e.currentTarget.dataset.viewindex!;


		this.setState(pre => {

			const selTimeArr = pre.selTimeArr.setIn([viewIndex, field], value);
			return {
				selTimeArr,
			}
		},()=>{
			this.getSelTimeVal()
		})

	}

	

	timeValToTimeObj(is_init:boolean,props:calendarProps) {

		if(is_init){


			return Array.from({length:props.style!}).map(()=>{


				return {
						year:"",
						month:"",
						searson:"",
						day: "",
						hour: "",
						minute: "",
				}



			})



		}


		const { style, rotate, time,} = props;

		let  selTimeValArr = props.selTimeValArr;

		if(selTimeValArr && rotate! >1 && !selTimeValArr.includes("-")){

			selTimeValArr ="";
		}


		const defaultTimeArr = selTimeValArr!.split(",");

		const curTimeArr = Array.from({ length: style! }, () => Object.assign({}, this.curTime));
		const has_defaultTime = !!selTimeValArr;

		const hour = this.curTime.hour;
		const minute = this.curTime.minute;

		const setTime = (item: string) => {


			const arr = !time ? item.split("-") : item.split(" ")[0].split("-");
			const year = ~~arr[0];

			switch (rotate) {
				case calendarType.day: {
					const month = ~~arr[1];
					const timeArr = time ? item.split(" ")[1].split(":") : null;
					return {
						year,
						month,
						searson: Math.ceil(month / 3),
						day: ~~arr[2],
						hour: timeArr ? timeArr[0] : hour,
						minute: timeArr ? timeArr[1] : minute,
					}
				}
				case calendarType.month: {
					const month = ~~arr[1];
					return {
						year,
						month,
						searson: Math.ceil(month / 3),
						day: 1,
						hour,
						minute,
					}

				}
				case calendarType.searson: {
					const searson = ~~(arr[1].substr(1));
					return {
						year,
						month: searson * 3 - 2,
						searson,
						day: 1,
						hour,
						minute,
					}

				}
				case calendarType.year: {
					return {
						year,
						month: 1,
						searson: 1,
						day: 1,
						hour,
						minute,
					}
				}
			}
		}


		const selTimeArr = curTimeArr.map((val, index) => {
			return !has_defaultTime ? val : setTime(defaultTimeArr[index])!
		});


		return selTimeArr;


	}

	getTimeStrArr(selTimeArr:calendarState["selTimeArr"],rotate:calendarState["rotate"],time:boolean){
	
		const getStr = (val: commonInterface["showTimeObj"], rotate: number,time:boolean) => {

			const year = val.get("year");
			if(!year){
				return "" ;
			}


			const	month = (val.get("month") + "").padStart(2, "0") ,
				day = (val.get("day") + "").padStart(2, "0") ,
				searson = val.get("searson");



			switch (rotate) {
				case calendarType.day:
					const timeStr = time ? " "+(val.get("hour") + "").padStart(2, "0") + ":" + (val.get("minute") + "").padStart(2, "0") + ":00" : "";
					return year + "-" + month + "-" + day  + timeStr;
				case calendarType.searson:
					return year + "-S" + searson;
				case calendarType.year:
					return year + "";
				case calendarType.month:
					return year + "-" + month;
			}
		}

		return selTimeArr.map(val => {
			return getStr(val, rotate,time)!;
		});
	}

	getSelTimeVal() {

		const { selTimeArr, rotate } = this.state;
		const { time, clickBack, field } = this.props;
		const strArr = this.getTimeStrArr(selTimeArr,rotate,time!);

		
		

		clickBack && clickBack( strArr.toJS(), field!,rotate);

		const str = strArr.join(" 至 ")

		this.setState({
			calendarVal:str
		})

		return str;
	}

	dropHandle = () => {

		this.setState(pre => ({ expand: !pre.expand }));

	}
	render() {

		const { hasInp, time, width, placeholder,ableClear,noChangeRotate } = this.props;
		const { expand, selTimeArr, rotate,calendarVal } = this.state;

		const flagSelTimeArr = selTimeArr.getIn([0,"year"]) ? selTimeArr : Immutable.fromJS(this.timeValToTimeObj(false,this.props));

		return (
			<div className="g-calendar" style={{ width }} ref={this.wrapDomRef}>
				{hasInp ? <CalendarInp
					selTimeVal={calendarVal}
					dropHandle={this.dropHandle}
					placeholder={placeholder!}
					ableClear={ableClear!}
					clearTime={this.clearSelTime}

				/> : null}
				<VelocityComponent
					animation={expand ? "slideDown" : "slideUp"}
					interruptBehavior="queue"
					
				>
					<div className="g-calendar-box">
						<div style={{display:"flex"}}>
							<CalendarView
							rotate={rotate}
							selTimeObj={selTimeArr.get(0)!}
							showTimeObj={flagSelTimeArr.get(0)!}
							curTime={this.curTime}
							changeSelTimeItme={this.changeSelTimeItme}
							viewIndex={0}
							time={time!}
							changeTime={this.changeTime}
							changeRotate={this.changeRotate}
							nochangeRotate={noChangeRotate}
						/>
						{selTimeArr.size == 2 ? <CalendarView
							rotate={rotate}
							selTimeObj={selTimeArr.get(1)!}
							showTimeObj={flagSelTimeArr.get(1)!}
							curTime={this.curTime}
							changeSelTimeItme={this.changeSelTimeItme}
							viewIndex={1}
							time={time!}
							changeTime={this.changeTime}
							changeRotate={this.changeRotate}
							nochangeRotate={noChangeRotate}
						/> : null}
						</div>
						
					</div>

				</VelocityComponent>
			</div>

		)

	}

}

export default Calendar;
