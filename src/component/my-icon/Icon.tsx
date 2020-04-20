/**
 * @name 外部的字体图标库
 * @description 使用fontAwosome...
 */
import * as React from "react";


type props={
    className:string;
};
type states={

};
class Icon extends React.PureComponent<props,states>{

    state:states={

    };
    render(){
        const {className} = this.props;
        return (
            <i className={`${className}`}/>
        );
    }
}


export default Icon;