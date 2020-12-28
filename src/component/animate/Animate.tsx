/**
 * @author: SEKin 
 * @Date: 2020-12-15 16:30:05 
 * @description:  从方向、开始、结束、时间四个维度来体现动画,一般动画都分为两种状态，开始状态和结束状态；
 * 表现出来的属性： opacity、translate(x、y)
 * @Last Modified time: 2020-12-15 16:30:05 
 */

import * as React from "react";
import { tween } from "./tween";
const animateTypeArr = ["fadeIn", "fadeOut","bounceRightIn"];
const domAnimateProps = ["opacity","width","height"];
type AnimateType = "fadeIn" |  "fadeOut" | "bounceRightIn";
type domAnimateProp = {
  width?:number;
  opacity?: 0 | 1;
  height?:number;
  transform? :string;
}
type Props = {
  animation: AnimateType | domAnimateProp, // 动画效果过程
  elementStr?:"div"|"span",
  styleObj?:React.CSSProperties
  className?: string;
  duration?:number;
  runMount?:boolean; // 组件挂载的时候就展示
};
type States = {};
type animateState = {
  opacity?: number;
  width?: number;
  height?: number;
  transform?:number;
};
interface ISlideBox {
}
const easeTypeObj = {
  "fadeIn": "easeIn",
  "fadeOut": "easeIn",
  "bounceRightIn": "easeOutBack"
}
class SlideBox extends React.PureComponent<Props, States> implements ISlideBox {
  static defaultProps = {
    duration:300,
    elementStr:"div",
    className: "",
  }
  timer=0;
  boxDom: React.RefObject<HTMLDivElement> = React.createRef();
  state: States = {};
  easeType: keyof typeof tween;
  animateState:animateState ={};
  constructor(props: Props) {
    super(props);
    const {animation} = props;
    this.valideAnimation(animation);
    this.easeType = this.registerEaseType(animation);
  }

  valideAnimation(animation:Props["animation"]){
    if (typeof animation === "string") {
      if (!animateTypeArr.includes(animation)) {
        throw new Error('不存在改动画名称！请使用'+animateTypeArr.join('，')+"这些动画名称!");
      }
    } else if(typeof animation === "object"){
      const status= Object.keys(animation).some(val => {
        return !domAnimateProps.includes(val)
      })
      if (status) {
        throw new Error('不存在该动画属性！请使用'+domAnimateProps.join('，')+"这些动画属性!");
      }
    }
  }
  componentDidMount(){
    const { runMount,animation,duration} = this.props;
    this.animateState = this.getStart(animation, this.boxDom.current!,runMount);
    if(runMount){
        this.domExcute(this.boxDom.current!,animation as AnimateType,duration!,runMount);
    } else {
        // 初始化dom动画属性状态
        this.initAnimateStateToDom(animation, this.boxDom.current!);
    }
  }
  registerEaseType (animation:Props["animation"]):this["easeType"] {
     if (typeof animation === "string") {
      return easeTypeObj[animation] as this["easeType"];
    } 
    return "easeIn";
  }
  initAnimateStateToDom (animation:Props["animation"],dom:HTMLDivElement) {
    if (typeof animation === "string") {
      const show = animation.includes("In");
      if (animation === "bounceRightIn") {
        dom.style.transform = `translateX(${dom.clientWidth}px)`;
      }
      dom.style.opacity = show ? "1" : "0";
    } else {
       Object.keys(animation).map((key) => {
        const val = animation[key as keyof domAnimateProp]!;
        if (key === "transform") {
          dom.style.transform = val as string;
        }
        dom.style[key as any] = val + "px";
      })
    }
  }

  getStart(animation:Props["animation"],dom:HTMLDivElement,runMount?:boolean) {
    const animateState:animateState = {};
    if (typeof animation === "string") {
      const show = animation.includes("In");
      if (animation === "bounceRightIn") {
        animateState.transform = !runMount ? 0 :this.animateState.transform ? 0 :  dom.clientWidth;
      }
        animateState.opacity = !runMount ? show ? 1 : 0 : this.animateState.opacity ? 1 : 0;
    } else {
       Object.keys(animation).map((key) => {
        const val = animation[key as keyof domAnimateProp]!;
        if (key === "transform") {
          const translate = (val as string).match(/\d+/);
          animateState.transform = runMount ? 0 : translate ? translate[0] as unknown as number  : 0;
        }
        animateState[key as "opacity"] = runMount ? 0: val as number;
      })
    }
    return animateState;
  }
  domExcute(dom:HTMLDivElement,animation:AnimateType,duration:number, runMout?:boolean){
    if (this.timer) {
      return;
    }
    dom.style.display = "block"; // 让动画可以显示动画
    const ease = this.easeType;
    const timeEnd = Math.ceil(duration! / 17);
    const show = animation.includes("In");
    let time = 0 ;

   const start = this.animateState;
   const endObj = this.getStart(animation,dom, runMout);
   const fn = ()=>{
      this.timer = window.requestAnimationFrame(()=>{
          Object.keys(this.animateState).forEach(val => {
              const key = val as keyof animateState;
              if (key === "transform") {
                  const distance = tween[ease](time,start[key]!,endObj[key]!,timeEnd);
                  dom.style.transform =`translate(${distance}px, 0px)`;
              } else {
                  dom.style[key as any] = tween[ease](time, start[key]!,endObj[key]!,timeEnd) + "";
              }
            })
        if(time < timeEnd){
          fn();
        } else {
          dom.style.display = show ? "block" : "none";
        }
        time++;
      })
    } 
    fn();
    this.animateState = endObj;
  } 
  
  componentDidUpdate(preProps: Props) {
    if (this.props.animation!==preProps.animation) {
      this.domExcute(this.boxDom.current!,this.props.animation as AnimateType,this.props.duration!);
    }
  }

  render() {
    const { children,className,elementStr,runMount } = this.props;
    const style = runMount ? undefined : {display: this.easeType.includes("In") ? "block" : "block"};
    return elementStr === "div" ? (
      <div 
        className={className}
        ref={this.boxDom}
        style={style}>
        {children}
      </div>
    ):( 
      <span
        className={className}
        ref={this.boxDom}
        style={style}>
        {children}
      </span>
    );
  }
}

export default SlideBox;
