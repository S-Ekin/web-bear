/**
 * @name 模态框
 * @description 把底部按钮放在父组件传过来
 * @time 2019-08-21
 */

import * as React from "react";
import * as ReactDom from "react-dom";
import { Animate } from "../animate/index"
import {SvgIcon} from "../my-icon/index";
import { Button } from "../button/index";


type ModalProps = {
		noshade?:boolean; //遮罩层透明
		wrap?:HTMLElement;
		tit:string;
		className?:string;
		field:string;//标识字段
		toggleFn:(field:string,show:boolean)=>void;
		width?:number;
        show:boolean;
		customFootFn?:()=>JSX.Element;
		sureFn?:(field:string)=>void;
};

type ModalState = {
	pointX:number;
	pointY:number;
	preShow:boolean;
	init:boolean;
};

interface IModal{
	wrap:HTMLElement;
	modalDom:React.RefObject<HTMLDivElement>;
	// 第一次初始化组件时，要是显示就初始化dom,否则不初始化
    headMouseDown(e:React.MouseEvent):void;
}
export default class Modal extends React.PureComponent<ModalProps,ModalState> implements IModal{

	static getDerivedStateFromProps(nextProps:ModalProps,preState:ModalState){
		if(nextProps.show!==preState.preShow){
			return {
				init:true
			};
		}else{
			return null;
		}
	}
	wrap:HTMLElement;
	constructor(props:ModalProps){
		super(props);
		const dom = document.getElementById("inner-wrap-modal");
		if (!dom) {
			throw new Error("不存在Modal组件的容器，请生成id为 inner-wrap-modal的div");
		}
			this.wrap = dom ;
	}
	modalDom:React.RefObject<HTMLDivElement> = React.createRef();
	
	state={
		pointX:0,
		pointY:0,
		preShow:this.props.show,
		init:false
	};
	
	headMouseDown=(e:React.MouseEvent)=>{
			const modalDom = (this.modalDom.current)!;
			const {pointY,pointX} = this.state;
			
			//主义要减去上一次移动留下的位置
			const diffPointX = e.clientX - pointX;
			const diffPointY = e.clientY - pointY;

			modalDom.onmousemove = (originE:MouseEvent)=>{
				this.setState({
							pointX: (originE.clientX - diffPointX),
							pointY: (originE.clientY - diffPointY),
				});
			};
	}
	close=()=>{
		const {toggleFn,field} = this.props;
		toggleFn(field,false);
	}

	sureFn=()=>{
		const {sureFn,field} = this.props;
		sureFn!(field);
	}
	
	headMouseUp=()=>{
        // tslint:disable-next-line: no-null-keyword
        (this.modalDom.current)!.onmousemove = null;
	}

	getModalFoot(){
		const {sureFn,customFootFn} = this.props;
		const content = sureFn ? (
			<>
				<Button handle={this.sureFn}>确定</Button>
				<Button styleType="line-btn" handle={this.close}>关闭</Button>
			</>
		):customFootFn?customFootFn():undefined;
		return content ? (
			<div className="m-Mfooter">
				{content}
			</div>
		) : undefined;
	}
	getModal(){

		const {children,wrap,tit,show,className,width} = this.props;
		const {pointX,pointY} = this.state;
        const widthObj = width ? {width:width}:undefined;
        const styleObj = {transform: `translate(${pointX}px, ${pointY}px)`,};
		const container = wrap ? wrap : this.wrap ;
		const component = (
						<Animate
							runMount={true}
							className={`g-modal ${className}`}
							animation={ show ? "bounceDownIn" : "bounceDownOut" }
							duration={350}
						>
							<div
							style={{height: "100%",}}
							ref={this.modalDom}
							onMouseUp={this.headMouseUp}
							>
							<div className="m-Mwrap">
								<div className="m-Mask" />
								<div className="m-Modal" style={styleObj}>
									<div className="m-Mtit" onMouseDown={this.headMouseDown}>
										<span className="tit-name">{tit}</span>
										<span className="m-Mclose" onClick={this.close}>
										<SvgIcon className="close" size="middle"/>
										</span>
									</div>

									<div className="m-Mbody" style={widthObj}>
										{children}
									</div>
									{this.getModalFoot()}
								</div>
							</div>
							</div>
						</Animate>
						);
		return ReactDom.createPortal(component, container);
	}
	render(){
		const {init} = this.state;
		return init ? this.getModal():<></>;
	}
}