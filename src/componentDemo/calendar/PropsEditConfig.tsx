/**
 * @name name
 * @description description
 * @time 2019-10-25
 */
import * as React from "react";
import {Input,CheckBox} from "@component/input/index";

type obj = {
        field: string;
        rotate: number; // 日历类型
        style:number;
        time: boolean; //可选择时间
        noInp: boolean;
  		require: boolean;
  		disabled: boolean;
  		valFormatt: "number" | "string",
        defaultTime: string; //最终显示的时间字符串
        width: number;
        placeholder: string;
        ableClear: boolean;
        renderCallBack: boolean;//初始化时，调用点击的回调函数
        noChangeRotate: boolean;//不能改变频率
    };

type Props={
    obj:IImmutalbeMap<obj>;
	changeState(key:keyof obj,val: any):void;
	changeTit(e:React.ChangeEvent<HTMLInputElement>):void;
};
type States={

};
interface IPropsEditConfig {
 inpChangeFn(e:React.ChangeEvent<HTMLInputElement>):void;
}


class PropsEditConfig extends React.PureComponent<Props,States> implements IPropsEditConfig{

    state:States={

    };
    inpChangeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget;
		const field = dom.name as keyof obj;
		let value:any = dom.value;
		if(['width',"rotate",'style'].includes(field)){
			value = ~~value;	
		}else if(["time","noInp","ableClear","noChangeRotate","renderCallBack", "disabled", "require"].includes(field)){

			value = value === "1" ? true :false ;
		}
		this.props.changeState(field,value);
    }
    render(){
        const {
            field,
            rotate,
            style,
            time, 
            noInp,
            defaultTime, 
            width,
            placeholder,
            ableClear,
            renderCallBack,
			disabled,
			valFormatt,
			require,
            noChangeRotate,
        } = this.props.obj.toJS();
        
        return (
          <div className="g-propsEdit">
            <div>
              <div className="inp-item">
                <Input name="field" changeFn={this.inpChangeFn} value={field}>
                  标识字段 field：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="width"
                  norequire={true}
                  changeFn={this.inpChangeFn}
                  type="number"
                  value={`${width}`}
                >
                  宽度 width：
                </Input>
              </div>
              <div className="inp-item">
                <span>禁用 disabled</span>
                <CheckBox
                  name="disabled"
                  value="1"
                  type="radio"
                  checked={disabled}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="disabled"
                  value="2"
                  type="radio"
                  checked={!disabled}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>频率 rotate：</span>
                <CheckBox
                  name="rotate"
                  value="1"
                  type="radio"
                  checked={~~rotate === 1}
                  changeHandle={this.inpChangeFn}
                >
                  年
                </CheckBox>
                <CheckBox
                  name="rotate"
                  value="2"
                  type="radio"
                  checked={~~rotate === 2}
                  changeHandle={this.inpChangeFn}
                >
                  季
                </CheckBox>
                <CheckBox
                  name="rotate"
                  value="3"
                  type="radio"
                  checked={~~rotate === 3}
                  changeHandle={this.inpChangeFn}
                >
                  月
                </CheckBox>
                <CheckBox
                  name="rotate"
                  value="4"
                  type="radio"
                  checked={~~rotate === 4}
                  changeHandle={this.inpChangeFn}
                >
                  日
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>样式 style：</span>
                <CheckBox
                  name="style"
                  value="1"
                  type="radio"
                  checked={~~style === 1}
                  changeHandle={this.inpChangeFn}
                >
                  单个
                </CheckBox>
                <CheckBox
                  name="style"
                  value="2"
                  type="radio"
                  checked={~~style === 2}
                  changeHandle={this.inpChangeFn}
                >
                  双个
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>显示时间 time：</span>
                <CheckBox
                  name="time"
                  value="1"
                  type="radio"
                  checked={time}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="time"
                  value="0"
                  type="radio"
                  checked={!time}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>必选 require：</span>
                <CheckBox
                  name="require"
                  value="1"
                  type="radio"
                  checked={require}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="require"
                  value="0"
                  type="radio"
                  checked={!require}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>隐藏日期框 noInp：</span>
                <CheckBox
                  name="noInp"
                  value="1"
                  checked={noInp}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noInp"
                  value="0"
                  checked={!noInp}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <Input
				  disabled
                  value="返回true 变红"
                >
                  值验证函数matchTimeStr
                </Input>
              </div>
            </div>
            <div>
              <div className="inp-item">
                <Input
                  name="placeholder"
                  norequire={true}
                  changeFn={this.inpChangeFn}
                  value={placeholder}
                >
                  提示语 placeholder：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="defaultTime"
                  norequire={true}
                  changeFn={this.inpChangeFn}
                  value={defaultTime}
                >
                  默认时间 defaultTime (格式：2020-12-08 12:05)：
                </Input>
              </div>
              <div className="inp-item">
                <span>能清空 ableClear：</span>
                <CheckBox
                  name="ableClear"
                  value="1"
                  type="radio"
                  checked={ableClear}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="ableClear"
                  value="0"
                  type="radio"
                  checked={!ableClear}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>不能改变频率 noChangeRotate：</span>
                <CheckBox
                  name="noChangeRotate"
                  value="1"
                  type="radio"
                  checked={noChangeRotate}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noChangeRotate"
                  value="0"
                  type="radio"
                  checked={!noChangeRotate}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>初始组件是调用点击函数 renderCallBack：</span>
                <CheckBox
                  name="renderCallBack"
                  value="1"
                  type="radio"
                  checked={renderCallBack}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="renderCallBack"
                  value="0"
                  type="radio"
                  checked={!renderCallBack}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>输出格式 valFormatt：</span>
                <CheckBox
                  name="valFormatt"
                  value="number"
                  type="radio"
                  checked={valFormatt === "number"}
                  changeHandle={this.inpChangeFn}
                >
                  number
                </CheckBox>
                <CheckBox
                  name="valFormatt"
                  value="string"
                  type="radio"
                  checked={valFormatt === "string"}
                  changeHandle={this.inpChangeFn}
                >
                  string
                </CheckBox>
              </div>
              <div className="inp-item">
                <Input
                  name="title"
                  norequire={true}
                  changeFn={this.props.changeTit}
                  value={defaultTime}
                >
                  左侧标题 children：
                </Input>
              </div>
              <div className="inp-item">
                <span className="lab-tit">点击之前 clickBefore?：</span>
                <span>点击前的回调函数，返回ture就不会选择当前点击的日期</span>
              </div>
            </div>
          </div>
        );
    }
}


export default PropsEditConfig;