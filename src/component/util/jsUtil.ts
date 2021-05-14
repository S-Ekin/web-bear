export const fnUtil = {
  throttle: function<k> (fn:(e: k) => void, time = 170): (e:k)=>void {
    let recoder = new Date().getTime();
    return function (e:k):void {
      const now = new Date().getTime();
      if (now - recoder > time) {
        fn(e);
        recoder = now;
      }
    };
  }
};
