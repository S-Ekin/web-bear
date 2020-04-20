/**
 * @name 输入框
 * @description description
 * @time 2019-08-19
 */
import * as React from "react";


type props={
    dataSet?:string;
    value:string;
    name?:string;
    type?:"text"|"number";
    width?:number;
    styleName?:"normal" ;
    norequire?:boolean ;
    changeFn(e:React.ChangeEvent<HTMLInputElement>):void;
};
type states={

};
interface IInput {
    getInpTit():JSX.Element |"";
}
class Input extends React.PureComponent<props,states> implements IInput{
    static defaultProps = {
        styleName:"normal",
    };

    state:states={

    };
    getInpTit(){
        const {children} = this.props;
        const lab = children ? (<span className="lab-tit">{children}</span>) : "";  

        return lab ;
    }
    render(){
        const {value,name,dataSet,styleName,changeFn,type,width,norequire} = this.props;
        const style = width ? {width:width} : undefined;
        const requireName = norequire ? ""  : !value ? "no-fill" :"";
        return (
			<label className="g-inp-lab">
				{this.getInpTit()}
				<input
					value={value}
					className={`s-inp ${styleName} ${requireName}`}
                    name={name}
                    type={type}
                    style={style}
					data-set={dataSet}
					onChange={changeFn}
				/>
			</label>
		);
    }
}


export default Input;