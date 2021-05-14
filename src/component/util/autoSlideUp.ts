/**
 * @author: SEKin ；
 * @Date: 2020-11-18 16:43:20 ；
 * @description:  点击空白处，自动收缩所有的类名为autoSlideUp的下拉面板；同一时间只会有一个面板是下拉状态
 * @Last Modified time: 2020-11-18 16:43:20 ；
 */
import {closertPar} from "./domUtil";
type Ifn = (arg: HTMLElement)=>void;
const eventData:{
  [key:string]: Ifn
} = {};
const event = {
  on: function (k:string, fn: Ifn):void {
    eventData[k] = fn;
  },
  emit: function (k:string, argObj:HTMLElement):void {
    const fn = eventData[k];
    if (!fn) {
      return;
    }
    eventData[k](argObj);
  },
  remove: function (k:string):void {
    if (eventData[k]) {
      delete eventData[k];
    }
  }
};
const slideOther = (_e:MouseEvent, excludekey?:string):void => {
  const activeCom = document.querySelector(".autoSlideUp") as HTMLDivElement;
  if (!activeCom) {
    return;
  }

  const k = activeCom.dataset.event!;
  if (excludekey && excludekey === k) {
    return;
  }
  event.emit(k, activeCom);
};


document.addEventListener("click", function (e:MouseEvent) {
  const target = e.target as HTMLElement;
  const par = closertPar(target, "autoSlideUp");
  if (par) { // 模拟事件冒泡
    return;
  }
  slideOther(e);
});
export {
  slideOther,
  event
};
