/**
 * @name 复选框和单选框
 * @description 自定义的复选框和单选框
 */
import * as React from "react";
import { SvgIcon } from "@component/icon";

type props = {
	changeHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
	checked: boolean;
	value?: string;
	name?: string;
	hasChecked?: boolean;
	type?: "checkbox" | "radio";
	disabled?:boolean;
	//children?:string | JSX.Element; // 标题
};
type states = {};
class CheckBox extends React.PureComponent<props, states> {
	static defaultProps={
		type:"checkbox" as "checkbox" | "radio",
	};
	state: states = {};
	clickFn=(e:React.MouseEvent<HTMLInputElement>)=>{
		e.stopPropagation();
	}
	render() {
		const { type,name,value,hasChecked,checked,changeHandle,children,disabled} = this.props;
		
		const className = checked ? "checkbox-marked" : hasChecked ? "checkbox-has-selected" :"checkbox-blank";
		return (
			<label className={`m-label m-lab-${type}`}>
				<span className="wrap-icon">
					<SvgIcon className={className} size="middle"/>
					<input
					type={type}
					className="checkBox-inp"
					name={name}
					checked={checked}
					value={value}
					onClick={this.clickFn}
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
