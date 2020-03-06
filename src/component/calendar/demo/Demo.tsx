/**
 * @name 日历
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import Calendar from "../index";
import PropsEditConfig from "../demo/PropsEditConfig";
import "./index.scss";
import { Button } from "@component/button/index";
import { Input, CheckBox } from "../../input/index";
import { createImmutableMap } from "@component/createImmutaleMap";
import CodeBlock from "@container/codeBlock/CodeBlock";

type calendarObj = {
  field: string;
  rotate: number; // 日历类型
  style: number;
  time: boolean; //可选择时间
  noInp: boolean;
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
  configObj: calendarObj;
  refreshId: number;
  outTimeVal: string;
  initTime: { time: string }; //初始化时间
};
interface IDemo {
  clickBack( 
    timeStr: string,
    field: string,
    rotate: CalendarSpace.commonInterface["rotate"],
    _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]): void;
}

const initObj = {
  field: "time",
  rotate: 3,
  style: 1,
  time: false,
  noInp: false,
  defaultTime: "",
  width: 280,
  placeholder: "",
  ableClear: false,
  renderCallBack: false,
  noChangeRotate: false
  
};

const str1 = `<Calendar
              key={refreshId}
              initTime={initTime}
              clickBack={this.clickBack}
              {...(configObj as any)}
            />
`;
const str2 = `function clickBack(
    timeStr: string,
    field: string,
    rotate: CalendarSpace.commonInterface["rotate"],
    _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
  ){
    console.log(timeStr, field, rotate,_selTimeList);
  }`;

class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    calendarObj: createImmutableMap<calendarObj>(initObj),
    configObj: initObj,
    initTime: { time: "" },
    outTimeVal: "",
    refreshId: 0
  };

  clickBack(
    timeStr: string,
    field: string,
    rotate: CalendarSpace.commonInterface["rotate"],
    _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
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
  
  render() {
    const { calendarObj, refreshId, configObj, outTimeVal,initTime } = this.state;

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
            />
            <Button handle={this.refreshConfig}>刷新配置</Button>
          </div>
          <div className="g-item-show">
            <PropsEditConfig obj={calendarObj} changeState={this.changeState} />
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
            <div className="inp-item">
              <Input
                name="initTime"
                changeFn={this.outsideChangeState}
                value={outTimeVal}
              >
                设置日历时间 initTime：
              </Input>
              <Button handle={this.outSetTime}>设置</Button>
            </div>
            <CodeBlock>{str1}</CodeBlock>
          </div>
          <div className="g-item-show">
            <CodeBlock>
            {str2}
            </CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
