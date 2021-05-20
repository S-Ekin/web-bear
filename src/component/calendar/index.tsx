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
  compareTimeRang
} from "./objectFn";
import {ICommonInterface} from "./calendar";
import { event } from "../util/autoSlideUp";

type Props = {
  field: string;
  excludeRotate?: string, // 1,2,3,4 ,排除的频率类型
  disabled?:boolean;
  require?: boolean;
  rotate?: ICommonInterface["rotate"]; // 日历类型
  style?: 1 | 2;
  time?: boolean; // 可选择时间
  noInp?: boolean;
  defaultTime?: string; // 最终显示的时间字符串
  width?: number;
  placeholder?: string;
  ableClear?: boolean;
  initTime?:{time:string};// 初始化时间
  renderCallBack?: boolean;// 初始化时，调用点击的回调函数
  noChangeRotate?: boolean;// 不能改变频率
  valFormatt?:"number" | "string" // number:clickBack 传数字值:20200821， string: 2020-08-21;
  clickBefore?:ICommonInterface["clickBack"];
  clickBack: ICommonInterface["clickBack"];
  matchTimeStr?:(field:string, value?:string)=>boolean; // 判断是否显示红色框，也就是验证框
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

// 一些固定的类型
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
    excludeRotate: "",
    placeholder: "",
    valFormatt: "number",
  };
  static  getDerivedStateFromProps (nextProps:Props, preState:States):Partial<States> | null {


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
        valFormatt,
        clickBefore,
      } = nextProps;
      const curTime = getCurTime();

      const objProps = nextProps.initTime ? Object.assign({}, nextProps, {defaultTime: nextProps.initTime.time}) : nextProps;
      const selTimeArr = Immutable.fromJS(
        timeStrValToTimeObjArr(ableClear!, objProps, curTime)
      );

      // 重置状态
      const timeVal = getInpTimeStrArr(selTimeArr, rotate!, time!);
      if (renderCallBack) {
        const str = timeStrToNumber(timeVal, valFormatt!).join(",");
        const forbid = clickBefore ? clickBefore(str, {
          field,
          rotate: rotate!,
          valFormatt: valFormatt!
        }, selTimeArr) : false;
        if (forbid) {
          return {
            preInitTime: nextProps.initTime,
            preRotate: nextProps.rotate,
          };
        }
        clickBack(str, {
          field,
          rotate: rotate!,
          valFormatt: valFormatt!
        }, selTimeArr);
      }
      let animationArr:States["showViewArr"] = new Array(5).fill("fadeOut");
      animationArr[nextProps.rotate!] = "fadeIn";
      const showTimeArr = selTimeArr.getIn([0, "year"])
        ? selTimeArr
        : Immutable.fromJS(
          timeStrValToTimeObjArr(false, objProps, curTime)
        );
      return {
        expand: false,
        selTimeArr,
        showTimeArr,
        pannelLastYear: showTimeArr.map((val:ICommonInterface["showTimeObj"]) => val.get("year")),
        calendarVal: timeVal.join(" 至 "),
        preInitTime: nextProps.initTime,
        rotate: nextProps.rotate,
        showViewArr: animationArr,
        preRotate: nextProps.rotate,

      };
    } else {
      return null;
    }
  }

  eventId = `${new Date().getTime()
    .toString()}-${this.props.field}`;
  curTime = getCurTime();
  fixProps = this.createFixProps();
  constructor (props:Props) {
    super(props);
    const {
      time,
      rotate,
      clickBack,
      clickBefore,
      field,
      ableClear,
      renderCallBack,
      valFormatt
    } = this.props;
    const selTimeArr = Immutable.fromJS(
      timeStrValToTimeObjArr(ableClear! && !this.props.defaultTime, this.props, this.curTime)
    );

    const timeVal = getInpTimeStrArr(selTimeArr, rotate!, time!);
    const showTimeArr = selTimeArr.getIn([0, "year"])
      ? selTimeArr
      : Immutable.fromJS(
        timeStrValToTimeObjArr(false, this.props, this.curTime)
      );

    if (renderCallBack) {
      const val = timeStrToNumber(timeVal, valFormatt!).join(",");
      const forbid = clickBefore ? clickBefore(val, {
        field,
        rotate: rotate!,
        valFormatt: valFormatt!
      }, selTimeArr) : false;
      if (!forbid) {
        clickBack(val, {
          field,
          rotate: rotate!,
          valFormatt: valFormatt!
        }, selTimeArr);
      }
    }
    this.state = {
      expand: false,
      selTimeArr,
      showTimeArr,
      calendarVal: timeVal.join(" 至 "),
      rotate: rotate!,
      pannelLastYear: showTimeArr.map((val:ICommonInterface["showTimeObj"]) => getLastYear(val.get("year"))),
      showViewArr: this.getShowViewArr(rotate!),
      preInitTime: props.initTime,
      preRotate: props.rotate
    };
  }

  getShowViewArr (rotate:ICommonInterface["rotate"]) {

    let animationArr:States["showViewArr"] = new Array(5).fill("fadeOut");
    animationArr[rotate] = "fadeIn";
    return animationArr;
  }

  // 改变基本类型的state
  changeBasicState=<K extends keyof States>(
    key:K,
    callback:(states:States)=>States[K],
    obj?:{
      showTimeObj:ICommonInterface['curTime'],
      viewIndex:number;
    }
  ) => {

    if (obj && key === "selTimeArr") {
      // 只比较开始时间和结束时间的大小
      const {selTimeArr, rotate} = this.state;
      const {time, clickBefore, field, valFormatt} = this.props;
      return compareTimeRang(
        selTimeArr,
        obj.viewIndex,
        obj.showTimeObj, // 最新选择的时间， 但是还没有更新到state上
        {
          rotate: rotate!,
          time: time!,
          field,
          valFormatt: valFormatt!,
          clickBefore,
        }
      );
    }

    if (key === "rotate" && this.props.clickBefore) {
      const {selTimeArr} = this.state;
      const {time, clickBefore, field, valFormatt} = this.props;
      const val = callback(this.state) as States["rotate"];
      const calendarVal = getInpTimeStrArr(selTimeArr, val as States["rotate"], time!).join(" 至 ");
      const str = timeStrToNumber(calendarVal.split(" 至 "), valFormatt!).join(",");
      if (clickBefore(str, {
        field,
        rotate: val,
        valFormatt: valFormatt!,
      }, selTimeArr)) {
        return true;
      }
    }

    this.setState((pre) => {
      const val = callback(pre);
      const {time} = this.props;
      let objState: (Partial<States>| null) = null;
      if (key === "selTimeArr") {
        const rotate = pre.rotate;
        const calendarVal = getInpTimeStrArr(val as States["selTimeArr"], rotate, time!).join(" 至 ");
        objState = {
          selTimeArr: val as States["selTimeArr"],
          calendarVal,
        };
      } else if (key === "rotate") {
        const selTimeArr = pre.selTimeArr;
        const calendarVal = getInpTimeStrArr(selTimeArr, val as States["rotate"], time!).join(" 至 ");
        const showViewArr = this.getShowViewArr(val as States["rotate"]);
        objState = {
          calendarVal: calendarVal,
          showViewArr: showViewArr,
          rotate: val as States["rotate"],
        };
      } else {
        objState = {
          [key as "rotate"]: val as States["rotate"],
        };
      }
      return objState as Pick<States, keyof States>;
    }, () => {
      if (["rotate", "selTimeArr"].includes(key)) {
        const {field, clickBack, valFormatt} = this.props;
        const {rotate, calendarVal, selTimeArr} = this.state;
        const val = timeStrToNumber(calendarVal.split(" 至 "), valFormatt!).join(",");
        clickBack(val, {
          field,
          rotate: rotate!,
          valFormatt: valFormatt!
        }, selTimeArr);
      }
    });
  }

  createFixProps () {
    const {style, time, noChangeRotate} = this.props;
    const obj = {
      style: style!,
      time: time!,
      noChangeRotate: noChangeRotate!
    };
    return obj;
  }
  documentClickFn = () => {
    this.setState({
      expand: false,
    });
  }

  componentDidMount () {
    event.on(this.eventId, this.documentClickFn);
  }
  componentWillUnmount () {
    event.remove(this.eventId);
  }

  drop () {
    const {
      style, excludeRotate
    } = this.props;
    const { expand, selTimeArr, rotate, showViewArr, showTimeArr, pannelLastYear} = this.state;

    const secondViews =
			selTimeArr.size === 2 ? (
			  <CalendarView
			    fixProps={this.fixProps}
			    excludeRotate={excludeRotate!}
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
    const showViewIndex = showViewArr.indexOf("fadeIn");
    const boxW = style! * ([235, 235, 228, 235, 292][showViewIndex]);
    return (
      <div className="g-calendar-box" style={{width: `${boxW}px`, }}>
        <SlideBox
          slide={expand}
        >
          <div style={{ display: "flex", }} >
            <CalendarView
              fixProps={this.fixProps}
              excludeRotate={excludeRotate!}
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
    );
  }

  renderCalendar () {
    const {
      noInp,
      width,
      placeholder,
      ableClear,
      style,
      require,
      disabled,
      field,
      matchTimeStr
    } = this.props;
    const { expand, calendarVal} = this.state;

    const inpCom = noInp ? undefined : (
      <CalendarInp
        field={field}
        inpVal={calendarVal}
        placeholder={placeholder!}
        disabled={disabled}
        require={require}
        matchTimeStr={matchTimeStr!}
        eventId={this.eventId}
        ableClear={ableClear!}
        curTime={this.curTime}
        changeBasicState={this.changeBasicState}
        style={style!}
      />
    );

    const activeName = expand ? "autoSlideUp" : "";
    return (
      <div
        className={"g-calendar " + activeName}
        data-event={this.eventId}
        style={{ width: ~~width !, }}
      >
        {inpCom}
        {disabled ? undefined : this.drop()}
      </div>
    );
  }

  render () {
    const { children } = this.props;
    return children ? (
      <div className="m-flex-center">
        <span className="lab-tit">{children}</span>
        {this.renderCalendar()}
      </div>
    ) : this.renderCalendar();
  }
}

export default Calendar;
