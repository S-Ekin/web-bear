/**
 * @name Svg图标
 * @description 使用阿里图标矢量库里自己上传的
 */
import * as React from "react";


type props={
    className:string;
    size:"big" | "middle" | "normal";
};
type states={

};
class SvgIcon extends React.PureComponent<props,states>{

    static defaultProps={
        size:"normal",
    };
    state:states={

    };
    render(){
        const {className,size} = this.props;

        return (
            <>
            <svg className={`icon ${size}`} aria-hidden="true">
                <use  xlinkHref={`#sekin-${className}`} />
            </svg>
            </>
        );
    }
}


export default SvgIcon ;