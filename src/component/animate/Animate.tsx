/**
 * @author: SEKin 
 * @Date: 2020-12-15 16:30:05 
 * @description:  从方向、开始、结束、时间四个维度来体现动画,一般动画都分为两种状态，开始状态和结束状态；
 * 表现出来的属性： opacity、translate(x、y)
 * @Last Modified time: 2020-12-15 16:30:05 
 */

import * as React from "react";
import { tween } from "./tween";
const animateTypeArr = ["fadeIn", "fadeOut"];
const domAnimateProps = ["opacity","width","height"];
type AnimateType = "fadeIn" |  "fadeOut";
type domAnimateProp = {
  width?:number;
  opacity?:number;
  height?:number;
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
interface ISlideBox {
  isDomProps:boolean;
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
  isDomProps = false;
  constructor(props: Props) {
    super(props);
    const {animation} = props;
    this.valideAnimation(animation);
  }

  valideAnimation(animation:Props["animation"]){
    if (typeof animation === "string") {
      if (!animateTypeArr.includes(animation)) {
        throw new Error('不存在改动画名称！请使用'+animateTypeArr.join('，')+"这些动画名称!");
      }
    } else if(typeof animation === "object"){
      this.isDomProps = true;
      const status= Object.keys(animation).some(val => {
        return !domAnimateProps.includes(val)
      })
      if (status) {
        throw new Error('不存在该动画属性！请使用'+domAnimateProps.join('，')+"这些动画属性!");
      }
    }
  }
  animate(){

  }
  domExcute(dom:HTMLDivElement){
    const {duration,animation} = this.props;
    const timeEnd = Math.ceil(duration! / 17);
    let time = 0 ;
    const begin = (animation as AnimateType ).includes("In") ? 0 : 1;
    if (begin) {
      dom.style.display = "block"
    }
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
      this.timer = 0;
    }
    const fn = ()=>{
      this.timer = window.requestAnimationFrame(()=>{
        dom.style.opacity = tween.easeInOutCubic(time,begin,1 - begin,timeEnd) + "";
        if(time < timeEnd){
          fn();
        } else {
          dom.style.display = !begin ? "block" : "none";
        }
        time++;
      })
    } 
    fn();
  }
  componentDidUpdate(preProps: Props) {
    if (this.props.animation!==preProps.animation) {
      this.domExcute(this.boxDom.current!);
    }
  }

  getStyle(animation:AnimateType){
    const show = animation.includes("In");
    const style = {
      opacity: show? 1 :0,
      display: show ? "block":"none"
    }
    return style;
  }

  render() {
    const { children,animation,className,elementStr } = this.props;
    const style = this.getStyle(animation as AnimateType);
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
