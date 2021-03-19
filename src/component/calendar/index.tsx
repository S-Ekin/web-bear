import * as React from "react";
import { SlideBox } from "../animate/index";
import * as Immutable from "immutable";
import CalendarView from "./CalendarView";
import CalendarInp from "./CalendarInp";
import {
  timeStrValToTimeObjArr,
  calendarType,
  getInpTimeStrArr,
  getCurTime,
  getLastYear,
  timeStrToNumber,
} from "./objectFn";
import {ICommonInterface} from "./calendar";
import { event } from "../util/autoSlideUp";

type Props = {
	field: string;
	rotate?: ICommonInterface["rotate"]; // 日历类型
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
		rotate: ICommonInterface["rotate"],
		selTimeList:States["selTimeArr"]
	) => void | boolean;
};

type States = {
	preRotate:Props['rotate'],
	preInitTime:Props['initTime'],
	expand: boolean;
	pannelLastYear:IImmutalbeList<number>;
	selTimeArr: IImmutalbeList<ICommonInterface["showTimeObj"]>;
	showTimeArr: IImmutalbeList<ICommonInterface["showTimeObj"]>;
	calendarVal: string;
	rotate:ICommonInterface["rotate"];
	showViewArr: ("fadeIn" | "fadeOut")[];
};

//一些固定的类型
type fixProps = {
	style:1|2;
	time:boolean;
	noChangeRotate:boolean;
} ;

 interface ICalendar {
	curTime:ICommonInterface["curTime"];
	fixProps:fixProps;
	changeBasicState:ICommonInterface["changeBasicState"];
	createFixProps():fixProps;
	getShowViewArr(rotate:ICommonInterface["rotate"]):States["showViewArr"];
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
		static  getDerivedStateFromProps(nextProps:Props,preState:States):Partial<States> | null {
			
	
		if (
			nextProps.initTime !== preState.preInitTime ||
			nextProps.rotate !== preState.preRotate
		) {
			const {
				time,
				rotate,
				clickBack,
				field,
				ableClear,
				renderCallBack,
			} = nextProps;
			const curTime = getCurTime();

			const objProps =nextProps.initTime? Object.assign({},nextProps,{defaultTime:nextProps.initTime.time}) :nextProps;
			const selTimeArr = Immutable.fromJS(
				timeStrValToTimeObjArr(ableClear!,objProps,curTime)
			);
			
			//重置状态
			const timeVal = getInpTimeStrArr(selTimeArr, rotate!, time!);
			if(renderCallBack){
					clickBack(timeStrToNumber(timeVal).join(",") ,field,rotate!,selTimeArr);
			}	
			let animationArr:States["showViewArr"] = new Array(5).fill("fadeOut");
			animationArr[nextProps.rotate!] = "fadeIn";
			const showTimeArr = selTimeArr.getIn([0, "year"])
			? selTimeArr
			: Immutable.fromJS(
				timeStrValToTimeObjArr(false, objProps,curTime)
			);
			return {
				expand: false,
				selTimeArr,
				showTimeArr,
				pannelLastYear: showTimeArr.map((val:ICommonInterface["showTimeObj"]) => {
					return val.get("year");
				}),
				calendarVal: timeVal.join(" 至 "),
				preInitTime:nextProps.initTime,
				rotate:nextProps.rotate,
				showViewArr:animationArr,
				preRotate:nextProps.rotate,

			};
		}else {
			return null ;
		}
	}
	
	eventId = `${new Date().getTime().toString()}-${this.props.field}`;
	curTime = getCurTime();
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
			timeStrValToTimeObjArr(ableClear! && !this.props.defaultTime, this.props,this.curTime)
		);

		const timeVal = getInpTimeStrArr(selTimeArr, rotate!, time!);
		const showTimeArr = selTimeArr.getIn([0, "year"])
			? selTimeArr
			: Immutable.fromJS(
				timeStrValToTimeObjArr(false, this.props,this.curTime)
			);
		this.state = {
			expand: false,
			selTimeArr,
			showTimeArr,
			calendarVal: timeVal.join(" 至 "),
			rotate:rotate!,
			pannelLastYear:showTimeArr.map((val:ICommonInterface["showTimeObj"])=>{
				return getLastYear(val.get("year"));
			}),
			showViewArr:this.getShowViewArr(rotate!),
			preInitTime:props.initTime,
			preRotate:props.rotate
		};

		if(renderCallBack){
			const val = timeStrToNumber(timeVal).join(",");
			clickBack(val, field, rotate!,selTimeArr);
		}
	}
	
	getShowViewArr(rotate:ICommonInterface["rotate"]){

		let animationArr:States["showViewArr"] = new Array(5).fill("fadeOut");
		animationArr[rotate] = "fadeIn";
		return animationArr;
	}

	//比较时间的大小
	compareTimeRang(
		selTimeArr:States["selTimeArr"],
		viewIndex:number,
		showTimeObj:ICommonInterface["curTime"],
		rotate:ICommonInterface["rotate"],
		time:boolean, //是否有时间点
		){

		const selTimeArrDate = selTimeArr.toJS();

		if(selTimeArrDate.length===1 || !selTimeArr.getIn([0,"year"])){
			return false ;
		}

		selTimeArrDate[viewIndex] = showTimeObj ;
		let startgtEnd = false;
		const startNode = selTimeArrDate[0];
		const endNode= selTimeArrDate[1];
		switch(rotate){
			case calendarType.day :{
				const mon1 = `${startNode.month}`.padStart(2,'0');
				const day1= `${startNode.day}`.padStart(2,'0');
				const mon2 = `${endNode.month}`.padStart(2,'0');
				const day2= `${endNode.day}`.padStart(2,'0');

				const startTime = `${startNode.year}${mon1}${day1}`;
				const endTime = `${endNode.year}${mon2}${day2}`;
				if(time){

					const hour1= `${startNode.month}`.padStart(2,'0');
					const minute1= `${startNode.day}`.padStart(2,'0');
					const hour2 = `${endNode.month}`.padStart(2,'0');
					const minute2= `${endNode.day}`.padStart(2,'0');

					startgtEnd = startTime + `${hour1}${minute1}`  > endTime + `${hour2}${minute2}`;

				}else{
					startgtEnd = startTime  > endTime;
				}
			}
			break;
			case calendarType.month :{
				const mon1 = `${startNode.month}`.padStart(2,'0');
				const mon2 = `${endNode.month}`.padStart(2,'0');
				startgtEnd = `${startNode.year}${mon1}` > `${endNode.year}${mon2}`;
			}
			break;
			case calendarType.searson :{
				const season1 = startNode.searson;
				const season2  = endNode.searson;
				startgtEnd = `${startNode.year}${season1}` > `${endNode.year}${season2}`;
			}
			break;
			case calendarType.year :{
				startgtEnd = `${startNode.year}` > `${endNode.year}`;
			}
			break;
			default:
				break;
		}
		return startgtEnd ;
	}
	//改变基本类型的state
	changeBasicState=<K extends keyof States>(
		key:K,
		callback:(states:States)=>States[K],
		obj?:{
			showTimeObj:ICommonInterface['curTime'],
			viewIndex:number;
		}
		)=>{


		if(obj && key==="selTimeArr"){ 
			//只比较开始时间和结束时间的大小
			const {selTimeArr,rotate} = this.state;
			const {time} = this.props;
			return this.compareTimeRang(
				selTimeArr,
				obj.viewIndex,
				obj.showTimeObj,
				rotate!,
				time!
				);
		}
		
		this.setState(pre=>{

			const val = callback(pre);
			let obj:any = {};
			const {time} = this.props;

			if(key === "selTimeArr"){
				const rotate = pre.rotate;
				const calendarVal = getInpTimeStrArr(val as States["selTimeArr"],rotate,time!).join(" 至 ");
				
				obj = {
					selTimeArr:val,
					calendarVal ,
				};
			}else if(key === "rotate"){
				const selTimeArr = pre.selTimeArr;
				const calendarVal = getInpTimeStrArr(selTimeArr,val as States["rotate"],time!).join(" 至 ");
				const showViewArr = this.getShowViewArr(val as States["rotate"]);
				return {
					calendarVal:calendarVal,
					showViewArr:showViewArr,
					rotate:val,
				};
			}else{
				obj= {
					[key]:val,
				};
			}
			return obj;
		},()=>{
			if(["rotate","selTimeArr"].includes(key)){
				const {field,clickBack} = this.props;	
				const {rotate,calendarVal,selTimeArr} = this.state;	
				const val =timeStrToNumber(calendarVal.split(" 至 ")).join(",");
				clickBack(val, field,rotate,selTimeArr);
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
	documentClickFn = () => {
				this.setState({
					expand: false,
				});
	}

	componentDidMount() {
		event.on(this.eventId,this.documentClickFn);
	}
	componentWillUnmount() {
		event.remove(this.eventId);
	}

	getSelTimeVal() {
		const { selTimeArr } = this.state;
		const { time, clickBack, field ,rotate} = this.props;
		const strArr = getInpTimeStrArr(selTimeArr, rotate!, time!);
		const str = strArr.join(" 至 ");
		this.setState({
			calendarVal: str,
		},()=>{
			const val = timeStrToNumber(strArr);
			clickBack(val.join(","), field!, rotate!,selTimeArr);
		});

		return str;
	}

	renderCalendar() {
		const {
			noInp,
			width,
			placeholder,
			ableClear,
			style,
		} = this.props;
		const { expand, selTimeArr, calendarVal ,rotate,showViewArr, showTimeArr,pannelLastYear} = this.state;

		const inpCom = noInp ? undefined : (
					<CalendarInp
						inpVal={calendarVal}
						placeholder={placeholder!}
						eventId={this.eventId}
						ableClear={ableClear!}
						curTime={this.curTime}
						changeBasicState={this.changeBasicState}
						style={style!}
					/>
				);
			
		const secondViews =
			selTimeArr.size === 2 ? (
				<CalendarView
					fixProps={this.fixProps}
					selTimeObj={selTimeArr.get(1)!}
					showTimeObj={showTimeArr.get(1)!}
					curTime={this.curTime}
					viewIndex={1}
					lastYear={pannelLastYear.get(1)!}
					showViewArr={showViewArr}
					rotate={rotate}
					changeBasicState={this.changeBasicState}
				/>
			) : (
				undefined
			);
		const activeName = expand ? "autoSlideUp" : "";		
		const showViewIndex = showViewArr.indexOf("fadeIn");
		const boxW = style!* ([235, 235, 228, 235, 292][showViewIndex]);
		return (
			<div
				className={"g-calendar "+activeName}
				data-event={this.eventId}
				style={{ width: ~~width !, }}
				>
				{inpCom}
				<div className="g-calendar-box" style={{width: `${boxW}px`,}}>
					<SlideBox
						slide={expand}
					>
						<div style={{ display: "flex", }} >
							<CalendarView
								fixProps={this.fixProps}
								selTimeObj={selTimeArr.get(0)!}
								showViewArr={showViewArr}
								curTime={this.curTime}
								lastYear={pannelLastYear.get(0)!}
								showTimeObj={showTimeArr.get(0)!}
								rotate={rotate}
								viewIndex={0}
								changeBasicState={this.changeBasicState}
							/>
							{secondViews}
						</div>
					</SlideBox>
				</div>
			</div>
		);
	}

	render(){
			const { children } = this.props;
			return children ? (
				<div className="m-flex-center">
					<span className="lab-tit">{children}</span>
					{this.renderCalendar()}
				</div>
			): this.renderCalendar();
		}
}

export default Calendar;
