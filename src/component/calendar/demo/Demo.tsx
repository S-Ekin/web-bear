/**
 * @name 日历
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import Calendar from "../index";
import PropsEditConfig from "../demo/PropsEditConfig";
type Props={

};
type States={
    calendarObj:{
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
            timeObj: string[],
            field: string,
            rotate: CalendarSpace.commonInterface["rotate"]
        ) => void;
    }
};
interface IDemo {
    click():void;
}
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={
       calendarObj:{
            field: "time",
            rotate: 3 ,
            style: 1,
            time: false, 
            noInp: false,
            defaultTime: "",
            width: 280,
            placeholder: "",
            ableClear: false,
            initTime: {time:""},
            renderCallBack: false,
            noChangeRotate: false,
            clickBack: (
                timeObj: any[],
                field: string,
                rotate: CalendarSpace.commonInterface["rotate"]
            )=>{
                console.log(timeObj,field,rotate);
            }
       } 
    };
    click=()=>{
        console.log(2);
        
    }
    getConfigCalendar(){

        const {calendarObj} = this.state;

        return (
                 <Calendar
                    {...calendarObj} 
                    />
                );
    }
    render(){
        const {calendarObj} = this.state;
        
        
        return (
			<div className="g-layout">
				<div className="g-layout-head">
                    日历样式
                </div>
				<div className="g-layout-article">
                    <div className="g-item-show">
					<h2 className="theme-txt">时间点日历</h2>
                    <div className="flex-between" >

                        {this.getConfigCalendar()}
                        <PropsEditConfig obj={calendarObj}/>
                    </div>
                    </div>
                </div>
			</div>
		);
    }
}


export default Demo;