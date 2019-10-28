import * as React from "react";
import { VelocityComponent } from "velocity-react";
import * as Immutable from "immutable";
import CalendarView from "./CalendarView";
import CalendarInp from "./CalendarInp";

type commonInterface = CalendarSpace.commonInterface;

enum calendarType {
	year = 1,
	searson = 2,
	month = 3,
	day = 4,
}

type Props = {
	field: string;
	rotate?: commonInterface["rotate"]; // 日历类型
	style?: 1 | 2;
	time?: boolean; //可选择时间
	noInp?: boolean;
	defaultTime?: string; //最终显示的时间字符串
	width?: number;
	placeholder?: string;
	ableClear?: boolean;
	initTime?:{time:string};//初始化时间
	renderCallBack?: boolean;//初始化时，调用点击的回调函数
	noChangeRotate?: boolean;//不能改变频率
	clickBack: (
		timeStr: string,
		field: string,
		rotate: commonInterface["rotate"],
		selTimeList:CalendarSpace.CalendarStates["selTimeArr"]
	) => void;
};

type States = CalendarSpace.CalendarStates;

//一些固定的类型
type fixProps=CalendarSpace.fixProps ;

interface ICalendar {
	curTime:commonInterface["curTime"];
	fixProps:fixProps;
	changeBasicState:commonInterface["changeBasicState"];
	createFixProps():fixProps;
	getShowViewArr(rotate:commonInterface["rotate"]):States["showViewArr"];
}

class Calendar extends React.PureComponent<Props, States>
	implements ICalendar  {
	static defaultProps = {
		rotate: calendarType.day,
		style: 1,
		defaultTime: "",
		width: 280,
		placeholder: "",
	};

	curTime = this.getCurTime();
	wrapDomRef: React.RefObject<HTMLDivElement> = React.createRef();
	fixProps = this.createFixProps();
	constructor(props:Props) {
		super(props);
		const {
			time,
			rotate,
			clickBack,
			field,
			ableClear,
			renderCallBack,
		} = this.props;
		const selTimeArr = Immutable.fromJS(
			this.timeStrValToTimeObjArr(ableClear!, this.props)
		);

		const timeVal = this.getInpTimeStrArr(selTimeArr, rotate!, time!);
		this.state = {
			expand: false,
			selTimeArr,
			calendarVal: timeVal.join(" 至 "),
			rotate:rotate!,
			showViewArr:this.getShowViewArr(rotate!)
		};

		if(renderCallBack){
			clickBack(this.state.calendarVal, field, rotate!,selTimeArr);
		}
	}
	getShowViewArr(rotate:commonInterface["rotate"]){

		let animationArr:States["showViewArr"] = new Array(5).fill("fadeOut");
		animationArr[rotate] = "fadeIn";
		return animationArr;
	}
	//改变基本类型的state
	changeBasicState=<K extends keyof States>(
		key:K,
		callback:(states:States)=>States[K]
		)=>{

		this.setState(pre=>{

			const val = callback(pre) as any ;
			let obj:any = {};
			const {time} = this.props;
			if(key === "selTimeArr"){
				const rotate = pre.rotate;
				const calendarVal = this.getInpTimeStrArr(val,rotate,time!).join(" 至 ");
				
				obj = {
					selTimeArr:val,
					calendarVal ,
				};
			}else if(key === "rotate"){
				const selTimeArr = pre.selTimeArr;
				const calendarVal = this.getInpTimeStrArr(selTimeArr,val,time!).join(" 至 ");
				const showViewArr = this.getShowViewArr(val);
				obj= {
					calendarVal ,
					showViewArr,
					rotate:val,
				};
			}else if(key==="showViewArr"){
				obj ={
					showViewArr:val,
				};

			}else{
				obj= {
					[key as "expand"]:val,
				};
			}

			return obj;
			
		},()=>{
			if(["rotate","selTimeArr"].includes(key)){
				const {field,clickBack} = this.props;	
				const {rotate,calendarVal,selTimeArr} = this.state;	
				clickBack(calendarVal,field,rotate,selTimeArr);
			}
			
		});
	}
	
	createFixProps(){
		const {style,time,noChangeRotate} = this.props;
		const obj = {
			style:style!,
			time:time!,
			noChangeRotate:noChangeRotate!
		};
		return obj;
	}

	componentWillReceiveProps(nextProps:Props) {
		if (
			nextProps.initTime !== this.props.initTime ||
			nextProps.rotate !== this.props.rotate
		) {
			const {
				time,
				rotate,
				clickBack,
				field,
				ableClear,
				renderCallBack,
			} = nextProps;

			const objProps =nextProps.initTime? Object.assign({},nextProps,{defaultTime:nextProps.initTime.time}) :nextProps;
			const selTimeArr = Immutable.fromJS(
				this.timeStrValToTimeObjArr(ableClear!,objProps)
			);
			
			//重置状态
			const timeVal = this.getInpTimeStrArr(selTimeArr, rotate!, time!);
			this.setState({
				expand: false,
				selTimeArr,
				calendarVal: timeVal.join(" 至 "),
			},()=>{
				if(renderCallBack){
					clickBack(selTimeArr,field,rotate!,selTimeArr);
				}	
			});
		}
	}
	documentClickFn = (e: MouseEvent) => {
		const target = e.target! as HTMLElement;
		const wrap = this.wrapDomRef.current!;

		if (target !== wrap && !wrap.contains(target)) {
				this.setState({
					expand: false,
				});
		}
	}

	componentDidMount() {
		document.addEventListener("click", this.documentClickFn);
	}
	componentWillUnmount() {
		document.removeEventListener("click", this.documentClickFn);
	}


	getCurTime() {
		const time = new Date();
		const year = time.getFullYear();
		const month = time.getMonth() + 1;
		const day = time.getDate();
		const searson = Math.ceil(month / 3);
		const hour = time.getHours();
		const minute = time.getMinutes();

		return { year, searson, month, day, hour, minute };
	}


	timeStrValToTimeObjArr(isInit: boolean, props:Props) {
		if (isInit) {
			return Array.from({ length: props.style! }).map(() => {
				return {
					year: "",
					month: "",
					searson: "",
					day: "",
					hour: "",
					minute: "",
				};
			});
		}

		const { style, rotate, time ,defaultTime} = props;

		const selTimeValStr =  `${defaultTime}`;
		//#todo:做时间格式验证
		// if (selTimeValArr && rotate! > 1 && !selTimeValArr.includes("-")) {
		// 	selTimeValArr = "";
		// }

		const defaultTimeArr = selTimeValStr.split(",");

		const curTimeArr = Array.from({ length: style! }, () =>
			Object.assign({}, this.curTime)
		);

		const hour = this.curTime.hour;
		const minute = this.curTime.minute;

		const setTime = (item: string) => {
			const arr = !time ? item.split("-") : item.split(" ")[0].split("-");
			const year = ~~arr[0];

			switch (rotate) {
				case calendarType.day: {
					const month = ~~arr[1];
					const timeArr = time ? item.split(" ")[1].split(":"):undefined;
					return {
						year,
						month,
						searson: Math.ceil(month / 3),
						day: ~~arr[2],
						hour: timeArr ? timeArr[0] : hour,
						minute: timeArr ? timeArr[1] : minute,
					};
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
					};
				}
				case calendarType.searson: {
					const searson = ~~arr[1].substr(1);
					return {
						year,
						month: searson * 3 - 2,
						searson,
						day: 1,
						hour,
						minute,
					};
				}
				case calendarType.year: {
					return {
						year,
						month: 1,
						searson: 1,
						day: 1,
						hour,
						minute,
					};
				}
			}
		};

		const selTimeArr = curTimeArr.map((val, index) => {
			return !selTimeValStr ? val : setTime(defaultTimeArr[index])!;
		});

		return selTimeArr;
	}

	//把时间转化为显示的inp框里的时间数组
	getInpTimeStrArr(
		selTimeArr: States["selTimeArr"],
		rotate:commonInterface["rotate"],
		time: boolean
	):string[] {
		const getStr = (
			val: commonInterface["showTimeObj"],
			rotate: number,
			time: boolean
		) => {

			const year = val.get("year");
			if (!year) {
				return "";
			}

			const month = `${val.get("month")}`.padStart(2, "0");

			switch (rotate) {
				case calendarType.day:
					const day = `${val.get("day")}`.padStart(2, "0");
					let timeStr="";
					if(time){
						const hour = `${val.get("hour")}`.padStart(2, "0");
						const minute = `${val.get("minute")}`.padStart(2, "0");
 						timeStr =  ` ${hour}:${minute}:00`;
					}
					return `${year}-${month}-${day}${timeStr}`;
				case calendarType.searson:
					const searson= `${val.get("searson")}`;
					return `${year}-S${searson}`;
				case calendarType.year:
					return `${year}`;
				case calendarType.month:
					return `${year}-${month}`;
			}
		};

		const listArr = selTimeArr.map(val => {
			return getStr(val, rotate, time)!;
		});

		return listArr.toJS();

	}
	timeStrToNumber(strArr:string[]){

		return strArr.map(val=>{

			return val.replace(/-/g,"").replace(/:/g,"").replace(/\s/g,"");
		});

	}
	getSelTimeVal() {
		const { selTimeArr ,calendarVal} = this.state;
		const { time, clickBack, field ,rotate} = this.props;
		const strArr = this.getInpTimeStrArr(selTimeArr, rotate!, time!);
		const str = strArr.join(" 至 ");
		this.setState({
			calendarVal: str,
		},()=>{
			clickBack(calendarVal, field!, rotate!,selTimeArr);
		});

		return str;
	}

	render() {
		const {
			noInp,
			width,
			placeholder,
			ableClear,
			style,
		} = this.props;
		const { expand, selTimeArr, calendarVal ,rotate,showViewArr} = this.state;

		const inpCom = noInp ? undefined : (
					<CalendarInp
						inpVal={calendarVal}
						placeholder={placeholder!}
						ableClear={ableClear!}
						changeBasicState={this.changeBasicState}
						style={style!}
					/>
				);
		
		const secondViews =
			selTimeArr.size === 2 ? (
				<CalendarView
					fixProps={this.fixProps}
					selTimeObj={selTimeArr.get(1)!}
					curTime={this.curTime}
					viewIndex={1}
					showViewArr={showViewArr}
					rotate={rotate}
					changeBasicState={this.changeBasicState}
				/>
			) : (
				undefined
			);

		return (
			<div
				className="g-calendar"
				style={{ width: ~~width !, }}
				ref={this.wrapDomRef}>
				{inpCom}
				<VelocityComponent
					animation={expand ? "slideDown" : "slideUp"}
					interruptBehavior="queue">
					<div className="g-calendar-box">
						<div style={{ display: "flex", }}>
							<CalendarView
								fixProps={this.fixProps}
								selTimeObj={selTimeArr.get(0)!}
								showViewArr={showViewArr}
								curTime={this.curTime}
								rotate={rotate}
								viewIndex={0}
								changeBasicState={this.changeBasicState}
							/>
							{secondViews}
						</div>
					</div>
				</VelocityComponent>
			</div>
		);
	}
}

export default Calendar;
