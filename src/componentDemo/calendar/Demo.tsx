/**
 * @name 日历
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import Calendar from "@component/calendar/index";
import PropsEditConfig from "./PropsEditConfig";
import "./index.scss";
import { Button } from "@component/button/index";
import { Input, CheckBox } from "@component/input/index";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import CodeBlock from "@container/codeBlock/CodeBlock";
import * as  CalendarSpace from "@component/calendar/calendar";
import {str1,str2} from './CodeStr';
type calendarObj = {
  field: string;
  rotate: number; // 日历类型
  style: number;
  time: boolean; //可选择时间
  noInp: boolean; 
  valFormatt: "number" | "string"; // 输出的时间格式 normal 是字符串
  disabled:boolean;
  defaultTime: string; //最终显示的时间字符串
  width: number;
  placeholder: string;
  ableClear: boolean;
  renderCallBack: boolean; //初始化时，调用点击的回调函数
  noChangeRotate: boolean; //不能改变频率
};
type Props = {};
type States = {
  calendarObj: IImmutalbeMap<calendarObj>;
  title:string;// 模态框标题
  configObj: calendarObj;
  refreshId: number;
  outTimeVal: string;
  initTime: { time: string }; //初始化时间
};
interface IDemo {
  clickBack( 
    timeStr: string,
    field: string,
    rotate: CalendarSpace.ICommonInterface["rotate"],
    _selTimeList: CalendarSpace.ICalendarStates["selTimeArr"]): void;
}

const initObj:calendarObj = {
  field: "time",
  rotate: 3,
  style: 1,
  time: false,
  noInp: false,
  valFormatt: "number",
  disabled: false,
  defaultTime: "",
  width: 280,
  placeholder: "",
  ableClear: false,
  renderCallBack: false,
  noChangeRotate: false
  
};
class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    calendarObj: createImmutableMap<calendarObj>(initObj),
    configObj: initObj,
    title: "",
    initTime: { time: "" },
    outTimeVal: "",
    refreshId: 0
  };

  clickBack(
    timeStr: string,
    field: string,
    rotate: CalendarSpace.ICommonInterface["rotate"],
    _selTimeList: CalendarSpace.ICalendarStates["selTimeArr"]
  ){
    console.log(timeStr, field, rotate,_selTimeList);
  }

  changeState = (key: keyof calendarObj, val: any) => {
    this.setState(pre => {
      return {
        calendarObj: pre.calendarObj.set(key, val)
      };
    });
  }

  outSetTime = () => {
    this.setState(pre => {
      return {
        initTime: { time: pre.outTimeVal }
      };
    });
  }

  outsideChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const field = dom.name as keyof calendarObj;
    let value: any = dom.value;
    if (field === "rotate") {
      value = ~~value;
      this.setState(pre => {
        return {
         
          configObj: Object.assign({}, pre.configObj, { rotate: value })
        };
      });
    } else {
      
      this.setState({
        outTimeVal: value
      });
    }
  }

  refreshConfig = () => {
    this.setState(pre => {
      return {
        refreshId: 1 + pre.refreshId,
        configObj: pre.calendarObj.toJS()
      };
    });
  }
  getCodeBlockTit1(){
    const { outTimeVal } = this.state;
    return (
               <div className="inp-item">
              <Input
                name="initTime"
                changeFn={this.outsideChangeState}
                  norequire={true} 
                value={outTimeVal}
              >
                设置日历时间 initTime：
              </Input>
              <Button handle={this.outSetTime}>设置</Button>
            </div>
            );
  }
  changeTitle = (e:React.ChangeEvent<HTMLInputElement>)=>{
    this.setState({
      title: e.currentTarget.value.trim(),
    })
  }
  render() {
    const { calendarObj, refreshId, configObj,initTime,title } = this.state;
    const rotate = configObj.rotate;

    return (
      <div className="g-layout calendar-demo">
        <div className="g-layout-head">
          <h3>日历样式</h3>
        </div>
        <div className="g-layout-article">
          <div className="g-item-show flex-between">
            <Calendar
              key={refreshId}
              initTime={initTime}
              clickBack={this.clickBack}
              {...(configObj as any)}
            >
              {title}
            </Calendar>
            <Button handle={this.refreshConfig}>刷新配置</Button>
          </div>
          <div className="g-item-show">
            <PropsEditConfig changeTit={this.changeTitle} obj={calendarObj} changeState={this.changeState} />
          </div>
          <div className="g-item-show">
            <div className="inp-item">
              <span>外部设置频率 rotate：</span>
              <CheckBox
                name="rotate"
                value="1"
                type="radio"
                checked={~~rotate === 1}
                changeHandle={this.outsideChangeState}
              >
                年
              </CheckBox>
              <CheckBox
                name="rotate"
                value="2"
                type="radio"
                checked={~~rotate === 2}
                changeHandle={this.outsideChangeState}
              >
                季
              </CheckBox>
              <CheckBox
                name="rotate"
                value="3"
                type="radio"
                checked={~~rotate === 3}
                changeHandle={this.outsideChangeState}
              >
                月
              </CheckBox>
              <CheckBox
                name="rotate"
                value="4"
                type="radio"
                checked={~~rotate === 4}
                changeHandle={this.outsideChangeState}
              >
                日
              </CheckBox>
            </div>
          </div>
          <div className="g-item-show">
           
            <CodeBlock tit={this.getCodeBlockTit1()}>{str1}</CodeBlock>
          </div>
          <div className="g-item-show">
            <CodeBlock tit='点击回调函数'>
            {str2}
            </CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
