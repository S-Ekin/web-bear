// 可查看 https://easings.net/# 不同的缓动函数效果和实现
const progress = (end:number, begin:number, factor:number) => {
    return factor * (end - begin) + begin;
};
export const tween = {
    linear: function (curTime:number, begin:number, end:number, duration:number):number {
        const factor = (curTime / duration);
        return progress(end, begin, factor);
    },
    easeIn: function (curTime:number, begin:number, end:number, duration:number):number {
        const factor = Math.pow(curTime / duration, 4);
        return progress(end, begin, factor);
    },
    easeInOutSine: function (curTime:number, begin:number, end:number, duration:number):number {
        const x = curTime / duration;
        const factor = (-(Math.cos(Math.PI * x) - 1) / 2);
        return progress(end, begin, factor);
    },
    easeOutQuint (x: number): number {
        return 1 - Math.pow(1 - x, 5);
    },
    easeInCirc (x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    },
    easeInOutCubic (curTime:number, begin:number, end:number, duration:number): number {
        const x = curTime / duration;
        const factor = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        return progress(end, begin, factor);
    }
};
