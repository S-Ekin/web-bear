/**
 * @name 复选框和单选框
 * @description 自定义的复选框和单选框
 */
import * as React from "react";

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
		
		return (
			<label className={`m-label m-lab-${type}`}>
				<input
					type={type}
					className={hasChecked ? "has-check" : undefined}
					name={name}
					checked={checked}
					value={value}
					onClick={this.clickFn}
					onChange={changeHandle}
					disabled={disabled}
				/>
				{children}
			</label>
		);
	}
}

export default CheckBox;
