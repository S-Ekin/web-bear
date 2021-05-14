export interface ICommonInterface {
  rotate: 1 | 2 |3 |4 ; // 日历类型
  valFormatt:"number" | "string";  // number:clickBack 传数字值:20200821， string: 2020-08-21;
  curTime:{
    year:number;
    searson:number;
    month:number;
    day:number;
    hour:number;
    minute:number;
  };
  fixProps :{
    style:1|2;
    time:boolean;
    noChangeRotate:boolean;
  } ;
  showTimeObj:IImmutalbeMap<ICommonInterface["curTime"]>;
  clickBack: (
    timeStr: string,
    props:{
      field: string,
      rotate: ICommonInterface["rotate"],
      valFormatt: ICommonInterface["valFormatt"]
    },
    selTimeList:ICalendarStates["selTimeArr"],
  ) => void | boolean;
  changeBasicState<K extends keyof ICalendarStates >(key:K, callback:(states:ICalendarStates)=>ICalendarStates[K],
    obj?:{
      showTimeObj:ICommonInterface['curTime'],
      viewIndex:number;
    }
  ):void | boolean;
}
export interface ICalendarStates {
  expand: boolean;
  pannelLastYear:IImmutalbeList<number>;
  selTimeArr: IImmutalbeList<ICommonInterface["showTimeObj"]>;
  showTimeArr: IImmutalbeList<ICommonInterface["showTimeObj"]>;
  calendarVal: string;
  rotate:ICommonInterface["rotate"];
  showViewArr: ("fadeIn" | "fadeOut")[];
}
