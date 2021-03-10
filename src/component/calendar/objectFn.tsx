
import {ICommonInterface,ICalendarStates} from "./calendar";
enum calendarType {
  year = 1,
  searson = 2,
  month = 3,
  day = 4
}

type Props = {
  rotate?: ICommonInterface["rotate"]; // 日历类型
  style?: 1 | 2;
  time?: boolean;
  defaultTime?: string;
};

const timeStrValToTimeObjArr = function(
  isInit: boolean,
  props: Props,
  curTime: ICommonInterface["curTime"]
) {
  if (isInit) {
    const { month,searson,hour,minute } = curTime;
    return Array.from({ length: props.style! }).map(() => {
      return {
        year: "",
        month,
        searson,
        day: 1,
        hour,
        minute,
      };
    });
  }

  const { style, rotate, time, defaultTime } = props;

  let selTimeValStr = `${defaultTime}`;
  // 做时间格式验证
  if (selTimeValStr) {
      const reg = /^\d{4}(-\d{2}){0,2}( [0-2]\d:\d{2})?$/;
      const  errorFormate = selTimeValStr.split(",").some(val=>{
        return !reg.test(val);
      });
      if(errorFormate){
  	    selTimeValStr = "";
      }
  }

  const defaultTimeArr = selTimeValStr.split(",");

  const curTimeArr = Array.from({ length: style! }, () =>
    Object.assign({}, curTime)
  );

  const hour = curTime.hour;
  const minute = curTime.minute;

  const setTime = (item: string) => {
    const arr = !time ? item.split("-") : item.split(" ")[0].split("-");
    const year = ~~arr[0];

    switch (rotate) {
      case calendarType.day: {
        const month = ~~arr[1];
        const timeArr = time ? item.split(" ")[1].split(":") : undefined;
        return {
          year,
          month,
          searson: Math.ceil(month / 3),
          day: ~~arr[2],
          hour: timeArr ? timeArr[0] : hour,
          minute: timeArr ? timeArr[1] : minute
        };
      }
      case calendarType.month: {
        const month = ~~arr[1];
        return {
          year,
          month,
          searson: Math.ceil(month / 3),
          day: 1,
          hour,
          minute
        };
      }
      case calendarType.searson: {
        const searson = ~~arr[1].substr(1);
        return {
          year,
          month: searson * 3 - 2,
          searson,
          day: 1,
          hour,
          minute
        };
      }
      case calendarType.year: {
        return {
          year,
          month: 1,
          searson: 1,
          day: 1,
          hour,
          minute
        };
      }
    }
  };

  const selTimeArr = curTimeArr.map((val, index) => {
    return !selTimeValStr ? val : setTime(defaultTimeArr[index])!;
  });

  return selTimeArr;
};

//把时间转化为显示的inp框里的时间数组
const getInpTimeStrArr = function(
		selTimeArr:ICalendarStates["selTimeArr"],
		rotate:ICommonInterface["rotate"],
		time: boolean
	):string[] {
		const getStr = (
			val: ICommonInterface["showTimeObj"],
			rotate: number,
			time: boolean
		) => {

			const year = val.get("year");
			if (!year) {
				return "";
			}

			const month = `${val.get("month")}`.padStart(2, "0");

			switch (rotate) {
				case calendarType.day:
					const day = `${val.get("day")}`.padStart(2, "0");
					let timeStr="";
					if(time){
						const hour = `${val.get("hour")}`.padStart(2, "0");
						const minute = `${val.get("minute")}`.padStart(2, "0");
 						timeStr =  ` ${hour}:${minute}:00`;
					}
					return `${year}-${month}-${day}${timeStr}`;
				case calendarType.searson:
					const searson= `${val.get("searson")}`;
					return `${year}-S${searson}`;
				case calendarType.year:
					return `${year}`;
				case calendarType.month:
					return `${year}-${month}`;
			}
		};

		const listArr = selTimeArr.map(val => {
			return getStr(val, rotate, time)!;
		}).toJS();

		return listArr[0] ? listArr : [""];

    };
    const getCurTime = function() {
		const time = new Date();
		const year = time.getFullYear();
		const month = time.getMonth() + 1;
		const day = time.getDate();
		const searson = Math.ceil(month / 3);
		const hour = time.getHours();
		const minute = time.getMinutes();

		return { year, searson, month, day, hour, minute };
  };
  
  const getLastYear = function (year:number){
		let viewIndex = year % 10;
		viewIndex = viewIndex === 0 ? 10 : viewIndex;
		const startTime = year - viewIndex + 1;
		return startTime + 9;
	};
// 把显示的时间字符串变为数字，方便传入后端
  const	timeStrToNumber = function (strArr:string[]){
		return strArr.map(val=>{
			return val.replace(/-/g,"").replace(/:/g,"").replace(/\s/g,"");
		});
	};

export { timeStrValToTimeObjArr, calendarType, getInpTimeStrArr ,getCurTime, getLastYear, timeStrToNumber};
