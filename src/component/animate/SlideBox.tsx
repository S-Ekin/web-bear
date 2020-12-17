/**
 * @author: SEKin
 * @Date: 2020-12-07 10:14:57
 * @description:  下拉组件,注意使用组件时，子组件的个数应该是一个
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
};
type States = {};
interface ISlideBox {
  slideFn: (slideDown: boolean) => void;
}
class SlideBox extends React.PureComponent<Props, States> implements ISlideBox {
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

  queueFn(slideDown: boolean): void {
    const { directionUp } = this.props;
    const dom = this.slideDom.current!;
    if (slideDown) {
      dom.style.display = "block";
      dom.style.height = "0px";
    }
    const child = dom.firstElementChild! as HTMLDivElement;
    const origin = child.clientHeight;

    const duration = 300;
    let timeFrom = 0;
    const timeEnd = Math.ceil(duration / 17);
    const dispaly = slideDown ? "block" : "none";
    const start = slideDown ? 0 : origin;
    const end = !slideDown ? 0 : origin;
    const direct = directionUp ? "top" : "bottom";
    child.style.position = "absolute";
    const originW = child.style.width;
    child.style.width = "100%";
    child.style[direct] = "0";

    const fn = () => {
      this.timer = window.requestAnimationFrame(() => {
        const h = tween.easeInOutSine(timeFrom, start, end, timeEnd);
        timeFrom++;
        dom.style.height = `${h}px`;
        if (timeFrom < timeEnd) {
          fn();
        } else {
          dom.style.display = dispaly;
          dom.style.height = "";
          this.timer = 0;
          if (this.arr.length) {
            const newSlide = this.arr.shift()!;
            this.queueFn(newSlide);
          }
          child.style.position = "";
          child.style[direct] = "";
          child.style.width = originW;
        }
      });
    };
    fn();
  }

  immediaFn(slideDown: boolean): void {
    const { directionUp } = this.props;
    const dom = this.slideDom.current!;
    const hasRun = !!this.timer;
    if (hasRun) {
      window.cancelAnimationFrame(this.timer);
      this.timer = 0;
    }
    if (slideDown && !hasRun) {
      dom.style.display = "block";
      dom.style.height = "0px";
    }
    const child = dom.firstElementChild! as HTMLDivElement;
    const origin = child.clientHeight;
    let start: number;

    const duration = 300;
    let timeFrom = 0;
    const timeEnd = Math.ceil(duration / 17);

    if (hasRun) {
      start = parseInt(dom.style.height, 0);
    } else {
      start = slideDown ? 0 : origin;
    }
    const end = !slideDown ? 0 : origin;
    const dispaly = slideDown ? "block" : "none";
    const direct = directionUp ? "top" : "bottom";
    const originW = child.style.width;
    child.style.position = "absolute";
    child.style[direct] = "0";
    child.style.width = "100%";
    const fn = () => {
      this.timer = window.requestAnimationFrame(() => {
        const h = tween.linear(timeFrom, start, end, timeEnd);
        timeFrom++;
        dom.style.height = `${h}px`;
        if (timeFrom < timeEnd) {
          fn();
        } else {
          dom.style.height = "";
          dom.style.display = dispaly;
          this.timer = 0;
          child.style.position = "";
          child.style[direct] = "";
          child.style.width = originW;
        }
      });
    };
    fn();
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
