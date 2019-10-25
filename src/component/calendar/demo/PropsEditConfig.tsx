/**
 * @name name
 * @description description
 * @time 2019-10-25
 */
import * as React from "react";
import {Input,CheckBox} from "../../input/index";
import {Button} from "../../button/index";

type Props={
    obj:{
        field: string;
        rotate: CalendarSpace.commonInterface["rotate"]; // 日历类型
        style: 1 | 2;
        time: boolean; //可选择时间
        noInp: boolean;
        defaultTime: string; //最终显示的时间字符串
        width: number;
        placeholder: string;
        ableClear: boolean;
        initTime: {time:""};//初始化时间
        renderCallBack: boolean;//初始化时，调用点击的回调函数
        noChangeRotate: boolean;//不能改变频率
        clickBack: (
            timeObj: any[],
            field: string,
            rotate: CalendarSpace.commonInterface["rotate"]
        ) => void;
    }
   
};
type States={

};
interface IPropsEditConfig {

}

const styleObj ={padding: 20, border: "1px solid", display: "flex",};

class PropsEditConfig extends React.PureComponent<Props,States> implements IPropsEditConfig{


    state:States={

    };
    inpChangeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget;
        const field = dom.name;
        console.log(field);
        

    }
    render(){
        const {obj:{
            field,
            rotate,
            style,
            time, 
            noInp,
            defaultTime, 
            width,
            placeholder,
            ableClear,
            initTime,
            renderCallBack,
            noChangeRotate,
            clickBack,
        }} = this.props;
        
        return (
			<div style={styleObj}>
				<div>
					<div className="inp-item">
						<p>标识字段</p>
						<Input
							name="field"
							changeFn={this.inpChangeFn}
							value={field}>
							field：
						</Input>
					</div>
					<div className="inp-item">
						<p>宽度</p>
						<Input
							name="width"
							changeFn={this.inpChangeFn}
							type="number"
							value={`${width}`}>
							width：
						</Input>
					</div>
					<div className="inp-item">
						<span>频率：</span>
						<CheckBox
							name="rotate"
							value="1"
							type="radio"
							checked={~~rotate === 1}
							changeHandle={this.inpChangeFn}>
							年
						</CheckBox>
						<CheckBox
							name="rotate"
							value="2"
							type="radio"
							checked={~~rotate === 2}
							changeHandle={this.inpChangeFn}>
							季
						</CheckBox>
						<CheckBox
							name="rotate"
							value="3"
							type="radio"
							checked={~~rotate === 3}
							changeHandle={this.inpChangeFn}>
							月
						</CheckBox>
						<CheckBox
							name="rotate"
							value="4"
							type="radio"
							checked={~~rotate === 4}
							changeHandle={this.inpChangeFn}>
							日
						</CheckBox>
					</div>
					<div className="inp-item">
						<span>样式：</span>
						<CheckBox
							name="style"
							value="1"
							type="radio"
							checked={~~style === 1}
							changeHandle={this.inpChangeFn}>
							单个
						</CheckBox>
						<CheckBox
							name="style"
							value="2"
							type="radio"
							checked={~~style === 2}
							changeHandle={this.inpChangeFn}>
							双个
						</CheckBox>
					</div>
					<div className="inp-item">
						<span>显示时间：</span>
						<CheckBox
							name="time"
							value="1"
							type="radio"
							checked={time}
							changeHandle={this.inpChangeFn}>
							是
						</CheckBox>
						<CheckBox
							name="time"
							value="0"
							type="radio"
							checked={!time}
							changeHandle={this.inpChangeFn}>
							否
						</CheckBox>
					</div>
					<div className="inp-item">
						<p>默认时间：</p>
						<Input
							name="defaultTime"
							changeFn={this.inpChangeFn}
							value={defaultTime}>
							defaultTime：
						</Input>
					</div>
					<div className="inp-item">
						<span>隐藏日期框：</span>
						<CheckBox
							name="noInp"
							value="1"
							checked={noInp}
							changeHandle={this.inpChangeFn}>
							是
						</CheckBox>
						<CheckBox
							name="noInp"
							value="0"
							checked={!noInp}
							changeHandle={this.inpChangeFn}>
							否
						</CheckBox>
					</div>
				</div>
				<div>
					<div className="inp-item">
						<p>提示语</p>
						<Input
							name="placeholder"
							changeFn={this.inpChangeFn}
							value={placeholder}>
							placeholder：
						</Input>
					</div>
					<div className="inp-item">
						<p>外部初始化日历时间</p>
						<Input
							name="initTime"
							changeFn={this.inpChangeFn}
							value={initTime.time}>
							initTime：
						</Input>
					</div>
					<div className="inp-item">
						<p>能清空：</p>
						<span>ableClear：</span>
						<CheckBox
							name="ableClear"
							value="1"
							type="radio"
							checked={ableClear}
							changeHandle={this.inpChangeFn}>
							是
						</CheckBox>
						<CheckBox
							name="ableClear"
							value="0"
							type="radio"
							checked={!ableClear}
							changeHandle={this.inpChangeFn}>
							否
						</CheckBox>
					</div>
					<div className="inp-item">
						<p>不能改变频率：</p>
						<span>noChangeRotate：</span>
						<CheckBox
							name="noChangeRotate"
							value="1"
							type="radio"
							checked={noChangeRotate}
							changeHandle={this.inpChangeFn}>
							是
						</CheckBox>
						<CheckBox
							name="noChangeRotate"
							value="0"
							type="radio"
							checked={!noChangeRotate}
							changeHandle={this.inpChangeFn}>
							否
						</CheckBox>
					</div>
					<div className="inp-item">
						<p>初始组件是调用点击函数：</p>
						<span>renderCallBack：</span>
						<CheckBox
							name="renderCallBack"
							value="1"
							type="radio"
							checked={renderCallBack}
							changeHandle={this.inpChangeFn}>
							是
						</CheckBox>
						<CheckBox
							name="ableClear"
							value="0"
							type="radio"
							checked={!renderCallBack}
							changeHandle={this.inpChangeFn}>
							否
						</CheckBox>
					</div>
                    <div className="inp-item" style={{width: 300,}}>
						<p>点击函数：</p>
						<span>clickBack</span>
                        <code >
                            function clickBack( 
                                timeArr,
                                field,
                                 rotate,){`{console.log(timeObj,field,rotate)}`}
                        </code>
					</div>
				</div>
                <div>
                    <Button>提交</Button>
                </div>
			</div>
		);
    }
}


export default PropsEditConfig;