/**
 * @name SEkin
 * @description description
 * @time 2020-11-25
 */
import * as React from "react";
import { fnUtil } from "../util/jsUtil";
import { IScrollMethods } from "./scroll";
import { tween } from "../animate/tween";
type Props = {
  height?: number;
  time?: number; // 有的scroll主体的高度变化是有动画的，需要过一段动画时间才能获取到最终的高度，这里传入动画时间。看菜单组件的应用
  bindIntiScroll?: (scrollMethods: IScrollMethods) => void;
  className?: string;
  scrollWidthAuto?:boolean;
  keepBarShow?: boolean;
};
type States = {
  showHBar: boolean;
  showWBar: boolean;
  moveBarH: number;
  moveBarW: number;
};

interface IScrollBox {
  locateBarH(e: React.MouseEvent<HTMLDivElement>): void;
}
class ScrollBox
  extends React.PureComponent<Props, States>
  implements IScrollBox {
  static defaultProps = {
    className: "",
  };
  moveHBar: React.RefObject<HTMLDivElement> = React.createRef();
  moveWBar: React.RefObject<HTMLDivElement> = React.createRef();
  scrollMain : React.RefObject<HTMLDivElement> = React.createRef();
  state: States = {
    showHBar: !!this.props.keepBarShow,
    showWBar: !!this.props.keepBarShow,
    moveBarH: 0,
    moveBarW: 0,
  };
  scrollBoxH = 0; // 整个容器的高度 高度随传递的参数变化
  scrollBoxW = 0; // 整个容器的高度 高度随传递的参数变化
  scrollMainH = 0; // 滚动的主体的高度，被scrollBox 包住 高度随内容变化
  scrollMainW = 0; // 滚动的主体的高度，被scrollBox 包住 高度随内容变化
  scrollMethods: IScrollMethods;
  timerH = 0;
  timerW = 0;
  upTimer = 0;
  moveStartTop: number | null = null; // 在开始滚动时，moveHBar的位置-距离顶部的距离
  constructor (props: Props) {
    super(props);
    this.scrollMethods = {
      initScroll: this.upDateInit,
      scrollToTop: this.scrollToTop,
    };
    if (props.bindIntiScroll) {
      props.bindIntiScroll(this.scrollMethods);
    }
  }
  scrollToTop = (top: number) => {
    const { moveBarH } = this.state;
    const scrollMain = this.scrollMain.current!;
    let h = top;
    const maxH = this.scrollMainH - this.scrollBoxH;
    if (maxH <= 0) {
      return;
    }
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    const factor = (this.scrollBoxH - moveBarH) / maxH;
    scrollMain.style.top = `${-h}px`;
    this.moveHBar.current!.style.top = `${h * factor}px`;
  }
  barHMove = (e: MouseEvent): void => {
    // 从静止开始启动
    const { moveBarH } = this.state;
    const dom = this.moveHBar.current!;
    const scrollMain = this.scrollMain.current!;
    const startH = +dom.dataset.top!;
    const moveDistance = e.clientY - +dom.dataset.y!;
    const maxH = this.scrollBoxH - moveBarH;
    let h = startH + moveDistance;
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    const factor = (this.scrollMainH - this.scrollBoxH) / maxH;
    dom.style.top = `${h}px`;
    scrollMain.style.top = `${-h * factor}px`;
  }
  barWMove = (e: MouseEvent): void => {
    // 从静止开始启动
    const { moveBarW } = this.state;
    const dom = this.moveWBar.current!;
    const scrollMain = this.scrollMain.current!;
    const startW = +dom.dataset.left!;
    const moveDistance = e.clientX - +dom.dataset.x!;
    const maxW = this.scrollBoxW - moveBarW;
    let w = startW + moveDistance;
    w = w < 0 ? 0 : w > maxW ? maxW : w;
    const factor = (this.scrollMainW - this.scrollBoxW) / maxW;
    dom.style.left = `${w}px`;
    scrollMain.style.left = `${-w * factor}px`;
  }
  // tslint:disable-next-line: member-ordering
  barHMoveEven = fnUtil.throttle(this.barHMove, 100);
  barWMoveEven = fnUtil.throttle(this.barWMove, 100);

  componentDidMount (): void {
    this.upDateInit(this.props.height);
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.timerH);
    window.cancelAnimationFrame(this.timerW);
    window.cancelAnimationFrame(this.upTimer);
    this.moveHBar.current!.parentElement!.parentElement!.onwheel = null;
  }

  upDateInit = (defaultH?: number): void => {
    this.updateVertical(defaultH);
    this.updatehorizontal();
  }

  updateVertical (defaultH?:number) {
    // 在 scrollMain 更新时和 鼠标划入整个div时， 会调用
    if (!this.moveHBar.current) {
      return;
    }
    const barInner = this.moveHBar.current;
    const scrollMain = this.scrollMain.current!;
    const curScrollMainH = scrollMain.clientHeight;
    if (!defaultH && curScrollMainH === this.scrollMainH) {
      return;
    }
    this.scrollBoxH = defaultH
      ? defaultH
      : scrollMain.parentElement!.clientHeight;
    this.scrollMainH = curScrollMainH;
    if (curScrollMainH < this.scrollBoxH) {
      // 没有超出容器
      scrollMain.style.top = "0";
      this.setState({
        showHBar: false,
      });
      return;
    }
    let moveBarH = Math.ceil(
      (this.scrollBoxH / curScrollMainH) * this.scrollBoxH
    );
    moveBarH = Math.max(16, moveBarH);

    const top = scrollMain.style.top || "0";
    let curScrollMainTop = -parseInt(top, 0);
    if (curScrollMainTop + this.scrollBoxH > curScrollMainH) {
      // 上次的scrollMain下滑的长度 大于现在的scrollMainH 整体的长度时，把现在的scrollMainH 下滑到最后
      curScrollMainTop = curScrollMainH - this.scrollBoxH;
      scrollMain.style.top = `${-curScrollMainTop}px`;
    }
    // 重计算moveHBar的位置，因为scroll变化了
    const maxH = this.scrollMainH - this.scrollBoxH;
    const factor = (this.scrollBoxH - moveBarH) / maxH;
    barInner.style.top = `${factor * curScrollMainTop}px`;

    this.animateScroll({
      start: this.state.moveBarH,
      end: moveBarH,
      isVertical: true
    }, () => {
      this.setState({
        moveBarH,
        showHBar: true,
      });
    });

  }

  updatehorizontal (defaultW?:number) {
    // 在 scrollMain 更新时和 鼠标划入整个div时， 会调用
    if (!this.moveWBar.current) {
      return;
    }
    const barInner = this.moveWBar.current;
    const scrollMain = this.scrollMain.current!;
    const curScrollMainW = scrollMain.clientWidth;
    if (!defaultW && curScrollMainW === this.scrollMainW) {
      return;
    }
    this.scrollBoxW = defaultW
      ? defaultW
      : scrollMain.parentElement!.clientWidth;
    this.scrollMainW = curScrollMainW;
    if (curScrollMainW < this.scrollBoxW) {
      // 没有超出容器
      scrollMain.style.left = "0";
      this.setState({
        showWBar: false,
      });
      return;
    }
    let moveBarW = Math.ceil(
      (this.scrollBoxW / curScrollMainW) * this.scrollBoxW
    );
    moveBarW = Math.max(16, moveBarW);

    const left = scrollMain.style.left || "0";
    let curScrollMainLeft = -parseInt(left, 0);
    if (curScrollMainLeft + this.scrollBoxW > curScrollMainW) {
      // 上次的scrollMain下滑的长度 大于现在的scrollMainW 整体的长度时，把现在的scrollMainW 下滑到最后
      curScrollMainLeft = curScrollMainW - this.scrollBoxW;
      scrollMain.style.left = `${-curScrollMainLeft}px`;
    }
    // 重计算moveWBar的位置，因为scroll变化了
    const maxW = this.scrollMainW - this.scrollBoxW;
    const factor = (this.scrollBoxW - moveBarW) / maxW;
    barInner.style.left = `${factor * curScrollMainLeft}px`;

    this.animateScroll({
      start: this.state.moveBarW,
      end: moveBarW,
      isVertical: false
    }, () => {
      this.setState({
        moveBarW,
        showWBar: true,
      });
    });

  }
  animateScroll (obj:{
    start: number,
    end: number,
    isVertical: boolean,
  }, callback: () => void) {
    const {start, end, isVertical} = obj;
    // 立马取消上一次的定时器事件
    if (isVertical) {
      window.cancelAnimationFrame(this.timerH);
      this.timerH = 0;
    } else {
      window.cancelAnimationFrame(this.timerW);
      this.timerW = 0;
    }
    let time = 0;
    const timeEnd = Math.floor(Math.sqrt(Math.abs(end - start)));
    const fn = isVertical ? () => {
      this.timerH = window.requestAnimationFrame(() => {
        const distance = String(tween.easeInCubic(time, start, end, timeEnd));
        this.moveHBar.current!.style.height = distance + "px";
        if (time < timeEnd) {
          fn();
        } else {
          this.timerH = 0;
          callback();
        }
        time++;
      });
    } : () => {
      this.timerW = window.requestAnimationFrame(() => {
        const distance = String(tween.easeInCubic(time, start, end, timeEnd));
        this.moveWBar.current!.style.width = distance + "px";
        if (time < timeEnd) {
          fn();
        } else {
          this.timerW = 0;
          callback();
        }
        time++;
      });
    };
    fn();
  }

  componentDidUpdate (prevProps: Props, prevState: States) {
    // todo:这里其实不应该在这在使用 setState，会导致某一次变动，更新两次。在  【getDerivedStateFromProps】里可以让变动更新一次，但是在它里面没法使用 refs来引用dom。
    // 但是又得在组件更新到真实的dom上后在操作实际的dom
    if (prevProps.height !== this.props.height) {
      this.upDateInit(this.props.height);
    } else if (this.state.showHBar === prevState.showHBar) {
      // 利用相等的情况，是因为当调用更新的生命周期时，证明这个 Scrooll组件所包裹的【滚动主体】肯定有更新，即高度发生变化。也就是子组件更新带动父组件Scroll更新。这里并不是因为传给Scroll组件的props变化或者Scroll自身的state变化而引起的
      // 这种情况案例是 菜单的收缩
      const { time } = this.props;
      const scrollMain = this.scrollMain.current!;
      if (this.upTimer) {
        window.cancelAnimationFrame(this.upTimer);
        this.upTimer = 0;
      }
      // 注意有两级定时器, 当滚动主体是在动画过程中改变高度时，要在动画完成后再来获取滚动主体的高度，否则获取的高度不准确，
      // 但是当动画主体不停地改变高度时——动画主体在不停的点击改变(不停地收缩展开)，应该立马完成上一次的动画。不然在滚动主体还在不停动画时，下面的time时间已经到了，于是获取的高度不准确。
      // 这种情况主要是应用在菜单组件中，当菜单有滚动条，并且收缩二级菜单时
      this.upTimer = window.setTimeout(() => {
        const curScrollMainH = scrollMain.clientHeight;
        if (curScrollMainH !== this.scrollMainH) {
          this.upDateInit(this.props.height);
          this.upTimer = 0;
        }
      }, time);
    }
  }

  barHClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget!.dataset.y = `${e.clientY}`;
    const top = parseInt(e.currentTarget!.style.top || "0", 0);
    e.currentTarget!.dataset.top = `${top}`;
    e.currentTarget.parentElement!.parentElement!.addEventListener(
      "mousemove",
      this.barHMoveEven
    );
    this.scrollMain.current!.classList.add("no-selected");
  }
  barWClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget!.dataset.x = `${e.clientX}`;
    const left = parseInt(e.currentTarget!.style.left || "0", 0);
    e.currentTarget!.dataset.left = `${left}`;
    e.currentTarget.parentElement!.parentElement!.addEventListener(
      "mousemove",
      this.barWMoveEven
    );
    this.scrollMain.current!.classList.add("no-selected");
  }
  cancelBarMove = (): void => {
    this.moveHBar.current!.parentElement!.parentElement!.removeEventListener(
      "mousemove",
      this.barHMoveEven
    );
    this.moveWBar.current!.parentElement!.parentElement!.removeEventListener(
      "mousemove",
      this.barWMoveEven
    );
    this.scrollMain.current!.classList.remove("no-selected");
  }
  mouseOver = (e: React.MouseEvent<HTMLDivElement>): void => {
    const dom = e.currentTarget;
    if (!dom.firstElementChild) {
      return;
    }
    if (this.scrollMainH > this.scrollBoxH) {
      dom.onwheel = this.stopWhell;
      this.setState({
        showHBar: true,
      });

      this.moveStartTop = parseInt(this.moveHBar.current!.style.top || "0", 0);
    } else {
      dom.onwheel = null;
    }
  }
  mouseLeave = (): void => {
    this.cancelBarMove();
    if (this.props.bindIntiScroll) {
      return;
    }
    this.setState({
      showHBar: false,
    });
  }
  mainMousewheel = (e: React.WheelEvent): void => {
    this.cancelBarMove();
    const {showHBar, moveBarH } = this.state;
    if (!showHBar) {
      return;
    }
    // 从静止开始启动
    const dom = e.currentTarget as HTMLDivElement;
    const scrollMain = this.scrollMain.current!;
    const startH = parseInt(scrollMain.style.top || "0", 0);
    // 判断是否阻止主页面的滚动 模拟真实的滚动条情况
    if (this.moveStartTop === null) {
      dom.onwheel = this.stopWhell;
    } else {
      if (e.deltaY < 0) { // 向上滚动
        if (this.moveStartTop < 5) {
          dom.onwheel = null;
        } else {
        // 不让带动主体页面滚动， 只让自己的组件滚动条滚动
          dom.onwheel = this.stopWhell;
          this.moveStartTop = null;
        }
      } else {
        if (this.moveStartTop > this.scrollBoxH - moveBarH - 5) {
          dom.onwheel = null;
        } else {
        // 不让带动主体页面滚动， 只让自己的组件滚动条滚动
          dom.onwheel = this.stopWhell;
          this.moveStartTop = null;
        }
      }
    }

    let step = Math.sqrt(this.scrollMainH / this.scrollBoxH) * 15;
    step = e.deltaY < 0 ? step : -step;
    let h = -(startH + step);
    const maxH = this.scrollMainH - this.scrollBoxH;
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    const factor = (this.scrollBoxH - moveBarH) / maxH;
    scrollMain.style.top = `${-h}px`;
    this.moveHBar.current!.style.top = `${h * factor}px`;
  }
  locateBarH = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { moveBarH } = this.state;
    let h = e.nativeEvent.offsetY;
    const dom = this.moveHBar.current!;
    const maxH = this.scrollBoxH - moveBarH;
    const factor = (this.scrollMainH - this.scrollBoxH) / maxH;
    const scrollMain = this.scrollMain.current!;
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    dom.style.top = `${h}px`;
    scrollMain.style.top = `${-h * factor}px`;
  }
  locateBarW = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { moveBarW } = this.state;
    let w = e.nativeEvent.offsetX;
    const dom = this.moveWBar.current!;
    const maxW = this.scrollBoxW - moveBarW;
    const factor = (this.scrollMainW - this.scrollBoxW) / maxW;
    const scrollMain = this.scrollMain.current!;
    w = w < 0 ? 0 : w > maxW ? maxW : w;
    dom.style.left = `${w}px`;
    scrollMain.style.left = `${-w * factor}px`;
  }
  stopProp =  (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }
  stopWhell= <k extends Event> (e: k) => {
    e.preventDefault();
  }
  render () {
    const { className, height, children, scrollWidthAuto } = this.props;
    const {showHBar, moveBarH, moveBarW, showWBar } = this.state;
    const style = height ? { height: `${height}px` } : undefined;
    return (
      <div
        className={`g-scrollBox ${className!}`}
        style={style}
        onMouseEnter={this.mouseOver}
        onMouseLeave={this.mouseLeave}
        onWheel={this.mainMousewheel}
        onMouseUp={this.cancelBarMove}
      >
        <div
          style={{ display: showHBar ? "block" : "none", }}
          className="m-scrollBar m-scrollHBar"
          onClick={this.locateBarH}
        >
          <div
            ref={this.moveHBar}
            className="m-moveBar m-moveHBar"
            style={{ height: `${moveBarH}px`, top: "0", }}
            onClick={this.stopProp}
            onMouseDown={this.barHClick}
          />
        </div>
        <div style={{height: "calc(100% - 16px)", width: "calc(100% - 16px)", overflow: "hidden", position: "relative"}}>
          <div className="m-scrollMain" style={{width: scrollWidthAuto ? undefined : "100%"}} ref={this.scrollMain}>{children}</div>
        </div>
        <div
          style={{ display: showWBar ? "block" : "none", }}
          className="m-scrollBar m-scrollWBar"
          onClick={this.locateBarW}
        >
          <div
            ref={this.moveWBar}
            className="m-moveBar m-moveWBar"
            style={{ width: `${moveBarW}px`, left: "0", }}
            onClick={this.stopProp}
            onMouseDown={this.barWClick}
          />
        </div>
      </div>
    );
  }
}

export default ScrollBox;
