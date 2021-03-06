// 可查看 https://easings.net/# 不同的缓动函数效果和实现
const progress = (_end:number, _begin:number, factor:number) => {
  const begin = _begin || 0;
  const end = _end || 0;
  return factor * (end - begin) + Number(begin);
};
export const tween = {
  linear: function (curTime:number, begin:number, end:number, duration:number):number {
    const factor = (curTime / duration);
    return progress(end, begin, factor);
  },
  easeInCubic: function (curTime:number, begin:number, end:number, duration:number):number {
    const x = curTime / duration;
    const factor = Math.pow(x, 3);
    return progress(end, begin, factor);
  },
  easeOutCubic: function (curTime:number, begin:number, end:number, duration:number):number {
    const x = curTime / duration;
    const factor = 1 - Math.pow(1 - x, 3);
    return progress(end, begin, factor);
  },
  easeInOutSine: function (curTime:number, begin:number, end:number, duration:number):number {
    const x = curTime / duration;
    const factor = (-(Math.cos(Math.PI * x) - 1) / 2);
    return progress(end, begin, factor);
  },
  easeInOutCubic (curTime:number, begin:number, end:number, duration:number): number {
    const x = curTime / duration;
    const factor = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    return progress(end, begin, factor);
  },
  easeOutBounce (curTime:number, begin:number, end:number, duration:number): number {
    let x = curTime / duration;
    let factor;
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      factor = n1 * x * x;
    } else if (x < 2 / d1) {
      factor = n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      factor = n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      factor = n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
    return progress(end, begin, factor);
  },
  easeOutBack (curTime:number, begin:number, end:number, duration:number): number {
    let x = curTime / duration;
    const c1 = 1.70158;
    const c3 = c1 + 1;

    let factor = 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    return progress(end, begin, factor);
  },
  easeInBack (curTime:number, begin:number, end:number, duration:number): number {
    let x = curTime / duration;
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const factor = c3 * x * x * x - c1 * x * x;
    return progress(end, begin, factor);
  },
};
