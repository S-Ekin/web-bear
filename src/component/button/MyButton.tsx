/**
 * 按钮
 * 背景样式 normal-btn:有背景无边框，line-btn：有边框无背景
 * 颜色：colorType
 */
import * as React from "react";
type BtnProps = {
	handle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	styleType: "normal-btn" | "dashed-btn" | "line-btn";//边框样式
    colorType?: "danger" | "primary" | "green" | "yellow"; //颜色
    className:string;//button className
	name?: string;//button 里的name
	val?: string;//button 里的value
	dataSet?: string;//button data-field 
	noAnimate?: boolean;
	disabled?:boolean;
};

type BtnState = {
	timeId: number | undefined;
};

class Button extends React.PureComponent<BtnProps, BtnState> {
	static defaultProps = {
		styleType: "normal-btn",
        colorType: "primary",
        className:"",
	};
	state = {
		timeId: undefined,
	};

	keyUp = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.currentTarget!;
		const { timeId } = this.state;

		if (timeId !== undefined) {
			window.clearTimeout(timeId);
		}
		target.classList.add("btn-clicked");
		const newTimeid = window.setTimeout(function() {
			target.classList.remove("btn-clicked");
		}, 400);

		this.setState({
			timeId: newTimeid,
		});
	}

	componentWillUnmount() {
		const timeId = this.state.timeId;
		if (timeId) {
			clearTimeout(timeId);
		}
	}

	render() {
		const {
			children,
			handle,
			styleType,
			colorType,
			name,
			val,
            noAnimate,
			className,
			dataSet,
			disabled,
		} = this.props;
		return (
			<button
				onClick={handle}
				data-field={dataSet}
				value={val}
				name={name}
				disabled={disabled}
				className={`s-btn ${styleType} ${className} ${colorType}`}
				onMouseUp={!noAnimate ? this.keyUp : undefined}>
				{children}
			</button>
		);
	}
}

export default Button ;
