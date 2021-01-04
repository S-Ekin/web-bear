/**
 * @author: SEKin 
 * @Date: 2020-12-15 16:30:05 
 * @description:  从方向、开始、结束、时间四个维度来体现动画,一般动画都分为两种状态，开始状态和结束状态；
 * 表现出来的属性： opacity、translate(x、y)
 * @Last Modified time: 2020-12-15 16:30:05 
 */

import * as React from "react";
import { tween } from "./tween";
const animateTypeArr = ["fadeIn", "fadeOut","bounceRightIn", "bounceDownIn", "bounceDownOut"];
const domAnimateProps = ["opacity","width","height","transform"];
import { AnimateType, domAnimateProp, animateState} from "./animateType"
type Props = {
  animation: AnimateType | domAnimateProp, // 动画效果过程
  spanWrapEle?:boolean,
  styleObj?:React.CSSProperties
  className?: string;
  display?:"block" | "inline-block" | "flex" ;
  duration?:number;
  runMount?:boolean; // 组件挂载的时候就展示
};
type States = {};

const easeTypeObj = {
  "fadeIn": "easeOutCubic",
  "fadeOut": "easeOutCubic",
  "bounceRightIn": "easeOutBack",
  "bounceDownIn": "easeOutBack",
  "bounceDownOut": "easeInBack",
}
class Animate extends React.PureComponent<Props, States>  {
  static defaultProps = {
    duration:300,
    elementStr:"div",
    className: "",
    display:"block"
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
    const run =  runMount ? "start" : undefined;
    this.animateState = this.getStart(animation, this.boxDom.current!,run);
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
    return "easeOutCubic";
  }
  initAnimateStateToDom (animation:Props["animation"],dom:HTMLDivElement) {
    if (typeof animation === "string") {
      const show = animation.includes("In");
      if (animation === "bounceRightIn") {
        dom.style.transform = `translateX(${dom.clientWidth}px)`;
      }
      dom.style.opacity = show ? "1" : "0";
      dom.style.display = show ? this.props.display! : "none";
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

  getStart(animation:Props["animation"],dom:HTMLDivElement,runMount?:"start"|"end") {
    const animateState:animateState = {};
    dom.style.display = this.props.display!; // 让动画可以显示动画
    if (typeof animation === "string") {
      const show = animation.includes("In");
      if (animation === "bounceRightIn") {
        if (runMount) {
          animateState.transform = runMount === "end" ? 0 :  dom.clientWidth;
        }else{
          animateState.transform = 0 ;
        }
      } else if (animation.includes("bounceDown")) {
         if (runMount) {
          animateState.transform = show ? runMount === "end" ? 0 :  -dom.clientHeight : runMount === "end" ? dom.clientHeight :  0 ;
        }else{
          animateState.transform = show ? 0 : dom.clientHeight ;
        }
      }
      if (runMount) {
          animateState.opacity  = show ? runMount === "end" ? 1 : 0 : runMount === "end" ? 0 :1;
        }else{
          animateState.opacity = show ? 1 : 0;
        }
    } else {
       Object.keys(animation).map((key) => {
        const val = animation[key as keyof domAnimateProp]!;
        if (key === "transform") {
          const translate = (val as string).match(/\d+/g);
          animateState.transform = runMount==="start" ? [0,0] : translate ? [Number(translate[0]),Number(translate[1] || 0)]  : [0,0];
        }else {
          animateState[key as "opacity"] = runMount === "start" ? 0: Number(val) as number;
        }
      })
    }
    return animateState;
  }
  domExcute(dom:HTMLDivElement,animation:AnimateType,duration:number, runMout?:boolean){
    if (this.timer) {
      // 取消上一次的动画时间，避免两次动画几乎同时执行时，产生错误的结果，
      // 例如日历快速的切换年、季频率，会导致同时显示年的视图和季的视图
      window.cancelAnimationFrame(this.timer);
      this.timer = 0;
    }
    const timeEnd = Math.ceil(duration! / 10);
    const animationType = typeof animation === "string" ? animation : "objIn";
    const show = animationType.includes("In");
    let time = 0 ;

   const start = this.animateState;
   const endObj = this.getStart(animation,dom, runMout ? "end" : undefined);
   const fn = ()=>{
      this.timer = window.requestAnimationFrame(()=>{
          Object.keys(this.animateState).forEach(val => {
              const key = val as keyof animateState;
              const ease = this.easeType;
                
              if (key === "transform") {
                if (animationType === "objIn") {

                  const transformB = start.transform as number[];
                  const transformE = endObj.transform as number[];
                  console.log(transformB, transformE, "domEx")
                  let distanceX = tween[ease](time,transformB[0],transformE[0],timeEnd);
                  let distanceY = tween[ease](time,transformB[1],transformE[1],timeEnd);
                  dom.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
                }else {
                  const distance = tween[ease](time,start[key] as number,endObj[key] as number,timeEnd);
                  dom.style.transform = animationType.includes("Down") ?`translate(0px,${distance}px)`:`translate(${distance}px, 0px)`;
                }
              } else {
                  const distance = tween[ease](time, start[key]!,endObj[key]!,timeEnd) + "";
                  dom.style[key as any] = distance + (key === "opacity" ? "" : "px") ;
              }
            })
        if(time < timeEnd){
          fn();
        } else {
          dom.style.display = show ? this.props.display! : "none";
          if (animationType.includes("bounce")){
            dom.style.transform  = "translate(0px, 0px)";
          }
          this.timer = 0;
        }
        time++;
      })
    } 
    fn();
    if (!runMout && animationType === "objIn") { // 直接用dom属性时，要转换一下顺序
      this.animateState =  endObj;
    }
  } 
  
  componentDidUpdate(preProps: Props) {
    const { animation,duration, runMount } = this.props;
    if (typeof animation === "string") {
      if (animation!==preProps.animation) {
            this.easeType = this.registerEaseType(animation);
            // 重新改变动画状态
            this.animateState = this.getStart(animation, this.boxDom.current!, "start");
            this.domExcute(this.boxDom.current!,animation as AnimateType,duration!);
        }
    } else {
      const compare = Object.keys(animation).some((val) => {
           const k = val as keyof domAnimateProp;
           return animation[k] !== (preProps.animation as domAnimateProp)[k]
      })
      if (compare) {
         this.easeType = this.registerEaseType(animation);
           if (runMount || typeof preProps.animation === "string") {
              this.animateState = this.getStart(animation, this.boxDom.current!, "start");
           }
            this.domExcute(this.boxDom.current!,animation as AnimateType,duration!);
      }
    }
  }

  componentWillUnmount(){
    if (this.timer) {
      window.cancelAnimationFrame(this.timer)
    }
  }

  render() {
    const { children,className,spanWrapEle, runMount, animation, styleObj} = this.props;
    const show = typeof animation === "string" && animation.includes("In") ? true : true;
    const opacity = typeof animation === "string" ? runMount ? show ? "0" : "1" :show ? "1" :"0" : "1";
    const style = Object.assign({opacity: opacity,}, styleObj)
    return !spanWrapEle ? (
      <div 
        className={className}
        ref={this.boxDom}
        style={style}
        >
        {children}
      </div>
    ):( 
      <span
        className={className}
        style={style}
        ref={this.boxDom}
        >
        {children}
      </span>
    );
  }
}

export default Animate;
