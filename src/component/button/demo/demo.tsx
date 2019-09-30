/**
 * @name name
 * @description description
 * @time 2019-09-18
 */
import * as React from "react";
import { Button, GroupBtn } from "@component/button/index";

type Props = {};
type States = {};
interface IDemo {}
type config = {
	color: "danger" | "primary" | "green" | "yellow"; //颜色
};
const configArr: config[] = [
	{
		color: "danger",
	},
	{
		color: "primary",
	},
	{
		color: "green",
	},
	{
		color: "yellow",
	},
];
const list = [
	{ id: "normal-btn", text: "normal" },
	{ id: "line-btn", text: "line" },
	{ id: "dashed-btn", text: "dashed" },
];
class Demo extends React.PureComponent<Props, States> implements IDemo {
	getItem() {
		return configArr.map(val => {
			const { color } = val;

			return (
				<div className="g-item-show" key={color}>
					<h2 className="theme-txt">{color}</h2>
					<div className="m-optBtn">
						<Button colorType={color} styleType="normal-btn">
							normal-btn
						</Button>
						<Button colorType={color} styleType="line-btn">
							line-btn
						</Button>
						<Button colorType={color} styleType="dashed-btn">
							dashed-btn
						</Button>
						<Button colorType={color} noAnimate={true}>
							noAnimate
						</Button>
					</div>
				</div>
			);
		});
	}
	groupFn=(field: string)=> {
		alert(field);
	}
	render() {
		const colorArrs = configArr.map(val => {
			const { color } = val;
			return (
				<Button colorType={color} key={color}>
					{color}
				</Button>
			);
		});
		return (
			<div className="g-layout">
				<div className="g-layout-head">
					<div className="m-optBtn">{colorArrs}</div>
					<div className="m-optBtn">
						<GroupBtn
							themeTxt="下拉按钮"
							list={list}
							clickFn={this.groupFn}
						/>
					</div>
				</div>
				<div className="g-layout-article">{this.getItem()}</div>
			</div>
		);
	}
}

export default Demo;