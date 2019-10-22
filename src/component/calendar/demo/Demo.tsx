/**
 * @name 日历
 * @description description
 * @time 2019-10-21
 */
import * as React from "react";
import Calendar from "../index";
type Props={

};
type States={

};
interface IDemo {
    click():void;
}
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

    };
    click=()=>{
        console.log(2);
        
    }
    render(){
        const {} = this.props;

        return (
			<div className="g-layout">
				<div className="g-layout-head">
                    日历样式
                </div>
				<div className="g-layout-article">
                    <div className="item">
                        <Calendar
                            field="time-single"
                            clickBack={this.click}
                        />
                    </div>
                     <div className="item">
                        <Calendar
                            field="time-single"
                            clickBack={this.click}
                            style={2}
                        />
                    </div>
                </div>
			</div>
		);
    }
}


export default Demo;