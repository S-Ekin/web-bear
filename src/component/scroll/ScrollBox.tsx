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
  time?: number; // 有的scroll主体的高度变化是有动画的，需要过一段动画时间才能获取到最终的高度，这里传入动画时间。
  bindIntiScroll?: (scrollMethods: IScrollMethods) => void;
  className?: string;
  keepBarShow?: boolean;
  noStopPageScroll?: boolean;
};
type States = {
  showBar: boolean;
  moveBarH: number;
  preH?: number;
};

interface IScrollBox {
  locateBar(e: React.MouseEvent<HTMLDivElement>): void;
}
class ScrollBox
  extends React.PureComponent<Props, States>
  implements IScrollBox {
  static defaultProps = {
    className: "",
  };
  moveBar: React.RefObject<HTMLDivElement> = React.createRef();
  state: States = {
    showBar: !!this.props.keepBarShow,
    moveBarH: 0,
  };
  scrollBoxH = 0; // 高度随传递的参数变化
  scrollMainH = 0; // 高度随内容变化
  scrollMethods: IScrollMethods;
  timer = 0;
  upTimer = 0;
  constructor(props: Props) {
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
    const scrollMain = this.moveBar.current!.parentElement!
      .previousElementSibling as HTMLDivElement;
    let h = top;
    const maxH = this.scrollMainH - this.scrollBoxH;
    if (maxH <= 0) {
      return;
    }
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    const factor = (this.scrollBoxH - moveBarH) / maxH;
    scrollMain.style.top = `${-h}px`;
    this.moveBar.current!.style.top = `${h * factor}px`;
  }
  barMove = (e: MouseEvent): void => {
    // 从静止开始启动
    const { moveBarH } = this.state;
    const dom = this.moveBar.current!;
    const scrollMain = dom.parentElement!
      .previousElementSibling! as HTMLDivElement;
    const startH = +dom.dataset.top!;
    const moveDistance = e.clientY - +dom.dataset.y!;
    const maxH = this.scrollBoxH - moveBarH;
    let h = startH + moveDistance;
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    const factor = (this.scrollMainH - this.scrollBoxH) / maxH;
    dom.style.top = `${h}px`;
    scrollMain.style.top = `${-h * factor}px`;
  }
  // tslint:disable-next-line: member-ordering
  barMoveEven = fnUtil.throttle(this.barMove, 100);

  componentDidMount(): void {
    this.upDateInit(this.props.height);
    if (!this.props.noStopPageScroll) {
      this.moveBar.current!.parentElement!.parentElement!.addEventListener(
        "wheel",
        this.stopWhell,
        { passive: false }
      );
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.timer);
    window.cancelAnimationFrame(this.upTimer);
    if (!this.props.noStopPageScroll) {
      this.moveBar.current!.parentElement!.parentElement!.removeEventListener(
        "wheel",
        this.stopWhell
      );
    }
  }

  upDateInit = (defaultH?: number): void => {
    // 在 scrollMain 更新时和 鼠标划入整个div时， 会调用
    const barInner = this.moveBar.current!;
    const scrollMain = barInner.parentElement!
      .previousElementSibling! as HTMLDivElement;
    const curScrollMainH = scrollMain.clientHeight;
    if (!defaultH && curScrollMainH === this.scrollMainH) {
      return;
    }
    this.scrollBoxH = defaultH
      ? defaultH
      : barInner.parentElement!.parentElement!.clientHeight;
    this.scrollMainH = curScrollMainH;
    if (curScrollMainH < this.scrollBoxH) {
      // 没有超出容器
      scrollMain.style.top = "0";
      this.setState({
        showBar: false,
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
    // 重计算 moveBar的位置，因为scroll变化了
    const maxH = this.scrollMainH - this.scrollBoxH;
    const factor = (this.scrollBoxH - moveBarH) / maxH;
    barInner.style.top = `${factor * curScrollMainTop}px`;

    this.animateScroll(this.state.moveBarH, moveBarH, () => {
      this.setState({
        moveBarH,
        showBar: true,
      });
    });
  }

  animateScroll(start: number, end: number, callback: () => void) {
    if (this.timer) {
      // 立马取消上一次的定时器事件
      window.cancelAnimationFrame(this.timer);
      this.timer = 0;
    }
    let time = 0;
    const timeEnd = Math.floor(Math.sqrt(Math.abs(end - start)));
    const fn = () => {
      this.timer = window.requestAnimationFrame(() => {
        const distance = String(tween.easeInCubic(time, start, end, timeEnd));
        this.moveBar.current!.style.height = distance + "px";
        if (time < timeEnd) {
          fn();
        } else {
          this.timer = 0;
          callback();
        }
        time++;
      });
    };
    fn();
  }

  componentDidUpdate(prevProps: Props, prevState: States) {
    // todo:这里其实不应该在这在使用 setState，会导致某一次变动，更新两次。在  【getDerivedStateFromProps】里可以让变动更新一次，但是在它里面没法使用 refs来引用dom。
    if (prevProps.height !== this.props.height) {
      this.upDateInit(this.props.height);
    } else if (this.state.showBar === prevState.showBar) { 
      // 利用相等的情况，是因为当调用更新的生命周清泉时，证明这个 Scrooll组件所包裹的【滚动主体】肯定有更新，即高度发生变化
      const { time } = this.props;
      const scrollMain = this.moveBar.current!.parentElement!
        .previousElementSibling! as HTMLDivElement;
      if(this.upTimer){
        window.cancelAnimationFrame(this.upTimer);
        this.upTimer = 0;
      }
      //注意有两级定时器, 当滚动主体是在动画过程中改变高度时，要在动画完成后再来获取滚动主体的高度，否则获取的高度不准确，
      // 但是当动画主体不停改变高度时，所以得让动画主体在不停的点击改变时，应该立马完成上一次的动画。不然在滚动主体还在不停动画时，下面的time时间已经到了，于是获取的高度不准确。
     this.upTimer = window.setTimeout(() => {
        const curScrollMainH = scrollMain.clientHeight;
        if (curScrollMainH !== this.scrollMainH) {
          this.upDateInit(this.props.height);
          this.upTimer = 0;
        }
      }, time);
    }
  }



  barClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget!.dataset.y = `${e.clientY}`;
    const top = parseInt(e.currentTarget!.style.top || "0", 0);
    e.currentTarget!.dataset.top = `${top}`;
    e.currentTarget.parentElement!.parentElement!.addEventListener(
      "mousemove",
      this.barMoveEven
    );
  }
  cancelBarMove = (): void => {
    this.moveBar.current!.parentElement!.parentElement!.removeEventListener(
      "mousemove",
      this.barMoveEven
    );
  }
  mouseOver = (e: React.MouseEvent<HTMLDivElement>): void => {
    const dom = e.currentTarget;
    if (!dom.firstElementChild) {
      return;
    }
    if (this.scrollMainH > this.scrollBoxH) {
      this.setState({
        showBar: true,
      });
    }
  }
  mouseLeave = (): void => {
    this.cancelBarMove();
    if (this.props.bindIntiScroll) {
      return;
    }
    this.setState({
      showBar: false,
    });
  }
  mainMousewheel = (e: React.WheelEvent): void => {
    this.cancelBarMove();
    const { showBar, moveBarH } = this.state;
    if (!showBar) {
      return;
    }
    // 从静止开始启动
    const dom = e.currentTarget as HTMLDivElement;
    const scrollMain = dom.firstElementChild! as HTMLDivElement;
    const startH = parseInt(scrollMain.style.top || "0", 0);
    let step = Math.sqrt(this.scrollMainH / this.scrollBoxH) * 14;
    step = e.deltaY < 0 ? step : -step;
    let h = -(startH + step);
    const maxH = this.scrollMainH - this.scrollBoxH;
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    const factor = (this.scrollBoxH - moveBarH) / maxH;
    scrollMain.style.top = `${-h}px`;
    this.moveBar.current!.style.top = `${h * factor}px`;
  }
  locateBar = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { moveBarH } = this.state;
    let h = e.nativeEvent.offsetY;
    const dom = this.moveBar.current!;
    const maxH = this.scrollBoxH - moveBarH;
    const factor = (this.scrollMainH - this.scrollBoxH) / maxH;
    const scrollMain = dom.parentElement!
      .previousElementSibling! as HTMLDivElement;
    h = h < 0 ? 0 : h > maxH ? maxH : h;
    dom.style.top = `${h}px`;
    scrollMain.style.top = `${-h * factor}px`;
  }
  stopProp<k extends Event>(e: k) {
    e.stopPropagation();
  }
  stopWhell<k extends Event>(e: k) {
    e.preventDefault();
  }
  render() {
    const { className, height, children, keepBarShow } = this.props;
    const { showBar, moveBarH } = this.state;
    const style = height ? { height: `${height}px` } : undefined;
    return (
      <div
        className={`g-scrollBox ${className}`}
        style={style}
        onMouseEnter={keepBarShow ? undefined : this.mouseOver}
        onMouseLeave={this.mouseLeave}
        onWheel={this.mainMousewheel}
        onMouseUp={this.cancelBarMove}
      >
        <div className="m-scrollMain">{children}</div>
        <div
          style={{ display: showBar ? "block" : "none", }}
          className="m-scrollBar"
          onClick={this.locateBar}
        >
          <div
            ref={this.moveBar}
            className="m-moveBar"
            style={{ height: `${moveBarH}px`, top: "0px", }}
            onClick={this.stopProp as any}
            onMouseDown={this.barClick}
          />
        </div>
      </div>
    );
  }
}

export default ScrollBox;
