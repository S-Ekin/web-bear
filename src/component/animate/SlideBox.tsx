/**
 * @author: SEKin
 * @Date: 2020-12-07 10:14:57
 * @description:  
 * 1、下拉组件,注意使用组件时，子组件的个数应该是一个。
 * 2、下拉组件的容器里，第一个div和最后一个div使用 margin-top | bottom 时，或者 下拉组件容器的父使用margin,而它又是第一个或是最后一个，
 * 则当下拉组件的高度为0时，会发生 margin 与margin 或 margin与padding合并
 * 导致在高度减少为0时或是突然由0开始增加，突然跳一下，这个就是margin合并引起的，
 * 可解决问题是，使用padding，
 * 或是 根据使用margin的div的位置，在它前面加一个元素，使其成为BFC,也就是加overflow:hidden;
 * 总之不要使使用margin 的div 直接与下拉容器接触（例如上重回或是下重合）。
 * 
 * 3、由于整个下拉容器是 overFlow：hidden;要是里面的内容超出，不会显示。
 *    首先真个下拉过程肯定是要 hidden,不然有滚动条，并且要隐藏的部分可以看到。
 *    只有在下拉完成后，恢复默认的initial 状态，这样下拉组件里的combobo的下拉即使超出了容器，整个容器也不会有滚动条，并且可以看见
 * 
 * @Last Modified time: 2020-12-07 10:14:57
 */

import * as React from "react";
import { tween } from "./tween";
type Props = {
  styleObj?:React.CSSProperties
  className?: string;
  isImmedia?: boolean; // 连续点击时，立马结束上一次动画
  slide: boolean;
  directionUp?: boolean; // 下拉框在显示框上还是下
  duration?:number;
  slideFnCallback?:(isStart?:boolean)=>boolean|void; // 收缩开始和结束的回调函数。 返回 true 禁止下拉
};
type States = {};
interface ISlideBox {
  slideFn: (slideDown: boolean) => void;
}
class SlideBox extends React.PureComponent<Props, States> implements ISlideBox {
  static defaultProps = {
    duration:300,
    slideFnCallback:()=>{
      return false;
    }
  };
  slideDom: React.RefObject<HTMLDivElement> = React.createRef();
  timer = 0;
  firstSlide = this.props.slide;
  arr: boolean[] = [];
  state: States = {};
  slideFn: (slideDown: boolean) => void;
  constructor(props: Props) {
    super(props);
    this.slideFn = props.isImmedia ? this.immediaFn : this.queue;
  }

  queue(): void {
    this.arr.push(this.props.slide);
    if (!this.timer) {
      // 启动函数
      const slide = this.arr.shift()!;
      this.queueFn(slide);
    }
  }

  componentDidUpdate(preProps: Props) {
    if (preProps.slide !== this.props.slide) {
      this.slideFn(this.props.slide);
    }
  }

  componentWillUnmount(){
    window.cancelAnimationFrame(this.timer);
  }

  queueFn(slideDown: boolean): void {
    const { directionUp,duration, slideFnCallback } = this.props;
    const dom = this.slideDom.current!;
    dom.style.overflow="hidden";
    if (slideDown) {
      dom.style.display = "block";
      dom.style.height = "0px";
    }
    const child = dom.firstElementChild! as HTMLDivElement;
    const origin = child.clientHeight;

    let timeFrom = 0;
    const timeEnd = Math.ceil(duration! / 12);
    const dispaly = slideDown ? "block" : "none";
    const start = slideDown ? 0 : origin;
    const end = !slideDown ? 0 : origin;
    const direct = directionUp ? "top" : "bottom";
    // 【设置样式位置】
    child.style.position = "absolute";
    const originW = child.style.width;
    child.style.width = "100%";
    child.style[direct] = "0";

    const fn = () => {
      this.timer = window.requestAnimationFrame(() => {
        const h = tween.easeInOutSine(timeFrom, start, end, timeEnd);
        timeFrom++;
        dom.style.height = `${h}px`;
        if (timeFrom <= timeEnd) {
          fn();
        } else {
          if (this.arr.length) {
            const newSlide = this.arr.shift()!;
            this.queueFn(newSlide);
          } else {
              // 【恢复样式位置设置】
              dom.style.display = dispaly;
              dom.style.height = "";
              child.style.position = "";
              child.style[direct] = "";
              child.style.width = originW;
              this.timer = 0; // 放在最后，以免当前的动画还没完成，又来了一次动画，导致【恢复样式设置】覆盖了初始的【设置样式位置】
              dom.style.overflow="initial";
              slideFnCallback!();
          }
        }
      });
    };
    if (!slideFnCallback!(true)) {
      fn();
    }
  }

  immediaFn(slideDown: boolean): void {
    const { directionUp, slideFnCallback, duration } = this.props;
    const dom = this.slideDom.current!;
    const hasRun = !!this.timer;
    if (hasRun) {
      window.cancelAnimationFrame(this.timer);
      this.timer = 0;
    }
    dom.style.overflow= "hidden";
    if (slideDown && !hasRun) {
      dom.style.display = "block";
      dom.style.height = "0px";
    }
    const child = dom.firstElementChild! as HTMLDivElement;
    const origin = child.clientHeight;
    let start: number;

    let timeFrom = 0;
    const timeEnd = Math.ceil(duration! / 17);

    if (hasRun) {
      start = parseInt(dom.style.height, 0);
    } else {
      start = slideDown ? 0 : origin;
    }
    const end = !slideDown ? 0 : origin;
    const dispaly = slideDown ? "block" : "none";
    const direct = directionUp ? "top" : "bottom";
    const originW = child.style.width;
    // 【设置样式位置】
    child.style.position = "absolute";
    child.style[direct] = "0";
    child.style.width = "100%";
    const fn = () => {
      this.timer = window.requestAnimationFrame(() => {
        const h = tween.linear(timeFrom, start, end, timeEnd);
        timeFrom++;
        dom.style.height = `${h}px`;
        if (timeFrom <= timeEnd) {
          fn();
        } else {
          dom.style.overflow= "initial";
          dom.style.height = "";
          dom.style.display = dispaly;
          // 【恢复样式设置】
          child.style.position = "";
          child.style[direct] = "";
          child.style.width = originW;
          this.timer = 0; // 放在最后，以免当前的动画还没完成，又来了一次动画，导致【恢复样式设置】覆盖了初始的【设置样式位置】
          slideFnCallback!();
        }
      });
    };
    if (!slideFnCallback!(true)) {
      fn();
    }
  }

  render() {
    const { children, className, styleObj } = this.props;
    const style = Object.assign({ display: this.firstSlide ? "block" : "none", }, styleObj);
    return (
      <div
        ref={this.slideDom}
        className={`g-slideBox ${className || ""}`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default SlideBox;
