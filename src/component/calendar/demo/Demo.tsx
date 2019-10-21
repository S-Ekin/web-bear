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
        <Calendar
                    field="time"
                    clickBack={this.click}
                />
                );
    }
}


export default Demo;