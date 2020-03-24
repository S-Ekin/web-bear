import * as React from "react";
import { VelocityComponent } from "velocity-react";
import * as Immutable from "immutable";
import CalendarView from "./CalendarView";
import CalendarInp from "./CalendarInp";
import {timeStrValToTimeObjArr,calendarType ,getInpTimeStrArr,getCurTime} from './objectFn';
import {ICommonInterface} from "./calendar";


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
	selTimeArr: IImmutalbeList<ICommonInterface["showTimeObj"]>;
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

			const objProps =nextProps.initTime? Object.assign({},nextProps,{defaultTime:nextProps.initTime.time}) :nextProps;
			const selTimeArr = Immutable.fromJS(
				timeStrValToTimeObjArr(ableClear!,objProps,getCurTime())
			);
			
			//重置状态
			const timeVal = getInpTimeStrArr(selTimeArr, rotate!, time!);
			if(renderCallBack){
					clickBack(selTimeArr,field,rotate!,selTimeArr);
			}	
			let animationArr:States["showViewArr"] = new Array(5).fill("fadeOut");
			animationArr[nextProps.rotate!] = "fadeIn";
			
			return {
				expand: false,
				selTimeArr,
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
	

	curTime = getCurTime();
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
			timeStrValToTimeObjArr(ableClear!, this.props,this.curTime)
		);

		const timeVal = getInpTimeStrArr(selTimeArr, rotate!, time!);
		this.state = {
			expand: false,
			selTimeArr,
			calendarVal: timeVal.join(" 至 "),
			rotate:rotate!,
			showViewArr:this.getShowViewArr(rotate!),
			preInitTime:props.initTime,
			preRotate:props.rotate
		};

		if(renderCallBack){
			clickBack(this.state.calendarVal, field, rotate!,selTimeArr);
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

		if(selTimeArrDate.length===1){
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

			const val = callback(pre) as any ;
			let obj:any = {};
			const {time} = this.props;

			if(key === "selTimeArr"){
				const rotate = pre.rotate;
				const calendarVal = getInpTimeStrArr(val,rotate,time!).join(" 至 ");
				
				obj = {
					selTimeArr:val,
					calendarVal ,
				};
			}else if(key === "rotate"){
				const selTimeArr = pre.selTimeArr;
				const calendarVal = getInpTimeStrArr(selTimeArr,val,time!).join(" 至 ");
				const showViewArr = this.getShowViewArr(val);
				return {
					calendarVal:calendarVal,
					showViewArr:showViewArr,
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

			console.log(obj);
			

			return obj;
			
		},()=>{
			if(["rotate","selTimeArr"].includes(key)){
				const {field,clickBack} = this.props;	
				const {rotate,calendarVal,selTimeArr} = this.state;	
				clickBack(calendarVal,field,rotate,selTimeArr);
			}
			console.log(this.state,"update");
			
			
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
	timeStrToNumber(strArr:string[]){

		return strArr.map(val=>{

			return val.replace(/-/g,"").replace(/:/g,"").replace(/\s/g,"");
		});

	}
	getSelTimeVal() {
		const { selTimeArr ,calendarVal} = this.state;
		const { time, clickBack, field ,rotate} = this.props;
		const strArr = getInpTimeStrArr(selTimeArr, rotate!, time!);
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
		console.log(showViewArr,'par');
			
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
