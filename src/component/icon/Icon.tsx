/**
 * @name 图标...
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
            <i className={`fa ${className}`}/>
        );
    }
}


export default Icon;