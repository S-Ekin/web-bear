/**
 * @name 空的盒子图标
 * @description description
 * @time 2019-08-21
 */
import * as React from "react";

type props={
    txt?:string;
};
type states={

};

class Empty extends React.PureComponent<props,states> {

    static defaultProps={
        txt:"内容为空！"
    }
    state:states={

    };
    render(){
        const {txt} = this.props;

       return (
            <div className="m-empty"> 
               <div className="empty-icon"/>
                 <p className="txt">
                     {txt}
                 </p>
            </div>
        );
    }
}


export default Empty;