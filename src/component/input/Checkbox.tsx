/**
 * @name 复选框和单选框
 * @description 自定义的复选框和单选框
 */
import * as React from "react";
import { SvgIcon } from "../my-icon/index";

type props = {
  changeHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  value?: string;
  name?: string;
  hasChecked?: boolean;
  type?: "checkbox" | "radio";
  disabled?:boolean;
  // children?:string | JSX.Element; // 标题
};
type states = {
};
class CheckBox extends React.PureComponent<props, states> {
  static defaultProps={
    type: "radio" as "checkbox" | "radio",
  };
  state: states = {};
  clickFn=(e:React.MouseEvent<HTMLLabelElement>) => {
		 e.stopPropagation();
  }
  getClassName (disabled?:boolean) {

    let name = "";
    const {type, checked, hasChecked} = this.props;

    if (type === "checkbox") {

      name  = checked ? "checkbox-marked" : hasChecked ? "checkbox-has-selected" : "checkbox-blank";
    } else {

      name = checked ? "radio-on" : "radio-off";

    }
    return disabled ? `dis-${name}` : name;
  }
  render () {
    const { type, name, value, checked, changeHandle, children, disabled} = this.props;
    const className = this.getClassName(disabled);
    const disabledName = disabled ? "disabled-box" : "";
    return (
      <label className={`m-label m-lab-${type!} ${disabledName}`} onClick={this.clickFn}>
        <span className={`wrap-icon ${className}`}>
          <SvgIcon className={className} />
          <input
            type={type}
            className="checkBox-inp"
            name={name}
            checked={checked}
            value={value}
            onChange={changeHandle}
            disabled={disabled}
          />
        </span>
        {children}
      </label>
    );
  }
}

export default CheckBox;
