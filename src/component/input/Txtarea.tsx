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
  width?:number;
  className?: string;
  norequire?:boolean ;
  changeFn?:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void;
  blurFn?:(e:React.ChangeEvent<HTMLTextAreaElement>) =>void;
};
type states={

};
interface ITextarea {
  getInpTit():JSX.Element |"";
}
class Textarea extends React.PureComponent<props, states> implements ITextarea {
  static defaultProps = {
    className: "",
  }
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
      className,
      changeFn,
      width,
      norequire,
      blurFn,
      placeholder,
      disabled,
    } = this.props;
    const style = width ? {width: width} : undefined;
    const noFill = norequire || disabled ? false : !value;
    const requireName = noFill ? "no-fill" : "";
    const disabledName = disabled ? "disabled" : "";
    return (
      <label className="g-inp-lab m-txt">
        {this.getInpTit()}
        <textarea
          value={value === null ? "" : value}
          className={`s-txt ${className!} ${requireName} ${disabledName}`}
          name={name}
          placeholder={placeholder}
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


export default Textarea;
