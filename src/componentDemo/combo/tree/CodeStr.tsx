export const data = [
  {
    text: "1",
    id: "1",
    children: [
      {
        text: "1-1",
        id: "1-1"
      },
      {
        text: "1-2",
        id: "1-2"
      }
    ]
  },
  {
    text: "2",
    id: "2",
    children: [
      {
        text: "2-1",
        id: "2-1",
        children: [
          {
            text: "2-1-1",
            id: "2-1-1"
          }
        ]
      },
      {
        text: "2-2",
        id: "2-2"
      }
    ]
  }
];

export const str1 =` //自定义显示框的文字内容，selected所选择的内容
  // formatterVal?: (selected: states["selected"]) => React.ReactChild;
              function formatterVal (selecteArr:IImmutalbeList<ComboSpace.Iselected>){

    console.log(selecteArr);
    
    return selecteArr.map(val=>{

      return '$-' + val.text
    }).join(',');
  }`;

  export const str2 =`//自定义下拉框的文字内容
  // formatterDropItem?: (node:IImmutalbeMap<any>) => React.ReactChild;
  function formatterDropItem (node:IImmutalbeMap<any>){

    return '自定义'+node.get('text');
  }`;

  export const str3 = `//点击或是选中之前做的操作，返回true不执行选中操作，默认返回false
  // clickOrCheckForbid?:(node:IImmutalbeMap<any>,field:string)=>boolean;
  clickOrCheckForbid(node: IImmutalbeMap<any>, field: string) {
    console.log("----clickOrCheckForbid-----");
    console.log(node, field);
    console.log("----clickOrCheckForbid-----");
    return false;
  }
  `;

  export const str4 = `
  /* data: any[];
  //外部通过这个值来控制下拉框的选中,多个id用字符串分隔
  initComboVal?:{id:string};
	//点击每行的回调函数
	clickCallback(selected: ComboSpace.Iselected[], field: string,node?:IImmutalbeMap<any>): void;
  */
 function clickCallback  (
    selecte: ComboSpace.Iselected[],
    field: string,
    node?: IImmutalbeMap<any>
  )  {
    console.log("-----clickCallback ---");
    console.log(selecte, field, node);
    console.log("-----clickCallback ---");
  };
 // 
    `;

