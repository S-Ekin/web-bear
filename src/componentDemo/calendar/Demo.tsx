/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {str1, str2, str3} from './CodeStr';
type IcalendarObj = {
  field: string;
  rotate: number; // 日历类型
  style: number;
  time: boolean; // 可选择时间
  noInp: boolean;
  valFormatt: "number" | "string"; // 输出的时间格式 normal 是字符串
  disabled:boolean;
  require:boolean;
  defaultTime: string; // 最终显示的时间字符串
  width: number;
  placeholder: string;
  ableClear: boolean;
  renderCallBack: boolean; // 初始化时，调用点击的回调函数
  noChangeRotate: boolean; // 不能改变频率
};
type Props = {

};
type States = {
  calendarObj: IImmutalbeMap<IcalendarObj>;
  title:string;// 模态框标题
  configObj: IcalendarObj;
  refreshId: number;
  outTimeVal: string;
  ableMatch: boolean;
  initTime: { time: string }; // 初始化时间
};
interface IDemo {
  clickBack:CalendarSpace.ICommonInterface["clickBack"];
}

const initObj:IcalendarObj = {
  field: "time",
  rotate: 3,
  style: 1,
  time: false,
  require: false,
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
    calendarObj: createImmutableMap<IcalendarObj>(initObj),
    configObj: initObj,
    title: "",
    initTime: { time: "" },
    outTimeVal: "",
    ableMatch: false,
    refreshId: 0
  };

  clickBack:CalendarSpace.ICommonInterface["clickBack"] = (
    _timeStr,
    obj,
    _selTimeList,
  ) => {
    console.log(_timeStr, obj, _selTimeList);
  }

  clickBefore:CalendarSpace.ICommonInterface["clickBack"] = (
    _timeStr,
    obj,
    _selTimeList
  ) => {
    console.log(_timeStr);
    console.log(_selTimeList);
    if (obj.field === "forbid") {
      alert("禁止选择");
      return true;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeState = (key: keyof IcalendarObj, val: any) => {
    this.setState((pre) => ({
      calendarObj: pre.calendarObj.set(key, val)
    }));
  }

  outSetTime = () => {
    this.setState((pre) => ({
      initTime: { time: pre.outTimeVal }
    }));
  }

  outsideChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const field = dom.name as keyof IcalendarObj;
    let value = dom.value;
    if (field === "rotate") {
      const val = ~~value;
      this.setState((pre) => ({
        configObj: Object.assign({}, pre.configObj, { rotate: val })
      }));
    } else {

      this.setState({
        outTimeVal: value
      });
    }
  }

  refreshConfig = () => {
    this.setState((pre) => ({
      refreshId: 1 + pre.refreshId,
      configObj: pre.calendarObj.toJS()
    }));
  }
  getCodeBlockTit1 () {
    const { outTimeVal } = this.state;
    return (
      <div className="inp-item">
        <Input
          name="initTime"
          changeFn={this.outsideChangeState}
          norequire
          value={outTimeVal}
        >
                设置日历时间 initTime：
        </Input>
        <Button handle={this.outSetTime}>设置</Button>
      </div>
    );
  }
  changeTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.currentTarget.value.trim(),
    });
  }
  getMatchTit () {
    const {ableMatch} = this.state;
    const fn = (e:React.ChangeEvent<HTMLInputElement>) => {
      const dom = e.currentTarget;
      const value = dom.value;
      this.setState({
        ableMatch: value === "1"
      });
    };
    return (<div className="inp-item">
      <span>开启验证 matchValFn：(有验证函数就不会去匹配norequire)</span>
      <CheckBox
        name="ableMatch"
        value="1"
        type="radio"
        checked={ableMatch}
        changeHandle={fn}
      >
                      是
      </CheckBox>
      <CheckBox
        name="ableMatch"
        value="2"
        type="radio"
        checked={!ableMatch}
        changeHandle={fn}
      >
                      否
      </CheckBox>
    </div>);
  }
  matchTimeStr = (_field: string, timeStr?: string) => {
    if (timeStr && timeStr.includes("2022")) {
      return true;
    }
  }
  render () {
    const { calendarObj, refreshId, configObj, initTime, title, ableMatch } = this.state;
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
              matchTimeStr={ableMatch ? this.matchTimeStr : undefined}
              initTime={initTime}
              clickBack={this.clickBack}
              clickBefore={this.clickBefore}
              {...(configObj as  any)}
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
          <div className="g-item-show">
            <CodeBlock tit={this.getMatchTit()} >{str3}</CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
