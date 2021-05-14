/**
 * @name 输入框
 * @description description
 * @time 2019-08-19
 */
import * as React from "react";


type props={
  dataSet?:string;
  placeholder?:string;
  disabled?:boolean;
  value?:string;
  name?:string;
  type?:"text"|"number";
  width?:number;
  styleName?:"normal";
  norequire?:boolean ;
  matchValFn?:(field:string, value:string)=>boolean; // 判断是否显示红色框，也就是验证框
  changeFn?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  blurFn?:(e:React.ChangeEvent<HTMLInputElement>) =>void;
};
type states={

};
interface IInput {
  getInpTit():JSX.Element |"";
}
class Input extends React.PureComponent<props, states> implements IInput {
  static defaultProps = {
    styleName: "normal",
  };

  state:states={

  };
  getInpTit () {
    const {children} = this.props;
    const lab = children ? (<span className="lab-tit">{children}</span>) : "";

    return lab;
  }
  render () {
    const {
      value,
      name,
      dataSet,
      styleName,
      changeFn,
      type,
      width,
      norequire,
      blurFn,
      placeholder,
      disabled,
      matchValFn,
    } = this.props;
    const style = width ? {width: width} : undefined;
    const noFill = matchValFn ? matchValFn(name!, value!) : norequire || disabled ? false : !value;
    const requireName = noFill ? "no-fill" : "";
    const disabledName = disabled ? "disabled" : "";
    return (
      <label className="g-inp-lab m-inp">
        {this.getInpTit()}
        <input
          value={value}
          className={`s-inp ${styleName!} ${requireName} ${disabledName}`}
          name={name}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          style={style}
          data-set={dataSet}
          onBlur={blurFn}
          onChange={changeFn}
        />
      </label>
    );
  }
}


export default Input;
