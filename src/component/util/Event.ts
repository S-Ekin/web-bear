/**
 * @name 事件发布订阅类
 * @description 用与不同级别的组件，共享一个状态的时候，为了避免抽取到公共的父组件所跨越的层级多，
 * 影响其他的无相关的组件更新，采取的发布订阅方法
 * @time 2020-04-17
 */
type IeventType = "menuClick" | "menuExpand" | "expandIcon";
type Fn<T extends MyAny> = (...args:T[])=>void;
class Event {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventObj: {[k:string]:Fn<any>[] | null} = {};
  // 订阅
  on <T> (eventType:IeventType, fn:Fn<T>) {
    let eventList =  this.eventObj[eventType];
    if (!eventList) {
      eventList = [];
      this.eventObj[eventType] = eventList;
    }
    eventList.push(fn);
  }
  // 发布
  emit (eventType:IeventType, ...other: MyAny[]) {
    let eventList =  this.eventObj[eventType];

    if (!eventList || !eventList.length) {
      return;
    }
    eventList.forEach((fn) => {
      fn(...other);
    });
  }

  remove (eventType:IeventType) {
    this.eventObj[eventType] = null;
    delete this.eventObj[eventType];
  }
}


const event = new Event();
export {event};

