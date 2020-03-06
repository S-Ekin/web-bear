/**
 * @name 日历
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import Calendar from "../index";
import PropsEditConfig from "../demo/PropsEditConfig";
import "./index.scss";
import { Input, CheckBox } from "../../input/index";
type Props = {};
type States = {
  calendarObj: {
    field: string;
    rotate: CalendarSpace.commonInterface["rotate"]; // 日历类型
    style: 1 | 2;
    time: boolean; //可选择时间
    noInp: boolean;
    defaultTime: string; //最终显示的时间字符串
    width: number;
    placeholder: string;
    ableClear: boolean;
    initTime: { time: "" }; //初始化时间
    renderCallBack: boolean; //初始化时，调用点击的回调函数
    noChangeRotate: boolean; //不能改变频率
    clickBack: (
      timeStr: string,
      field: string,
      rotate: CalendarSpace.commonInterface["rotate"],
      selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
    ) => void;
  };
};
interface IDemo {
  click(): void;
}
class Demo extends React.PureComponent<Props, States> implements IDemo {
  static soleId = 1;
  state: States = {
    calendarObj: {
      field: "time",
      rotate: 3,
      style: 1,
      time: false,
      noInp: false,
      defaultTime: "",
      width: 280,
      placeholder: "",
      ableClear: false,
      initTime: { time: "" },
      renderCallBack: false,
      noChangeRotate: false,
      clickBack: (
        timeStr: string,
        field: string,
        rotate: CalendarSpace.commonInterface["rotate"],
        _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
      ) => {
        console.log(timeStr, field, rotate);
      }
    }
  };
  click = () => {
    console.log(2);
  }

  changeState = <K extends keyof States["calendarObj"]>(
    key: K,
    val: States["calendarObj"][K]
  ) => {
    Demo.soleId++;
    this.setState(pre => {
      const obj = Object.assign({}, pre.calendarObj, { [key]: val });
      return {
        calendarObj: obj
      };
    });
  }
  getConfigCalendar() {
    const { calendarObj } = this.state;

    return <Calendar key={Demo.soleId} {...calendarObj} />;
  }
  outsideChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const field = dom.name as keyof States["calendarObj"];
    let value: any = dom.value;
    if (field === "rotate") {
      value = ~~value;
    } else {
      value = {
        time: value
      };
    }
    this.setState(pre => {
      const obj = Object.assign({}, pre.calendarObj, { [field]: value });
      return {
        calendarObj: obj
      };
    });
  }
  render() {
    const {
      calendarObj,
      calendarObj: { initTime, rotate }
    } = this.state;

    return (
      <div className="g-layout calendar-demo" >
        <div className="g-layout-head">
          <h3>日历样式</h3>
         </div>
        <div className="g-layout-article">
          <div className="g-item-show">
            <div>
              <h2 className="theme-txt">时间点日历</h2>
              {this.getConfigCalendar()}
            </div>
            <div className="box-set">
              <div className="g-outControl">
                <h3>外部控制</h3>
                <div className="inp-item">
                  <Input
                    name="initTime"
                    changeFn={this.outsideChangeState}
                    value={initTime.time}
                  >
                    设置日历时间 initTime：
                  </Input>
                </div>
                <div className="inp-item">
                  <span>频率 rotate：</span>
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
                <PropsEditConfig
                  obj={calendarObj}
                  changeState={this.changeState}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
