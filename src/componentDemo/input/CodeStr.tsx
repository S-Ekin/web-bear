export const str1 = `changeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget!;
        const dataSet = dom.dataset;
        const name = dom.name;
        const value = dom.value;
        console.log(dataSet,name);
        this.setState(pre=>{
            return {
                immuConfig:pre.immuConfig.set("value",value)
            };
        });
    }`;
    export const str2 = `changeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget!;
        const name = dom.name;
        const value = dom.value;
        console.log(name,value);
        this.setState(pre=>{
            return {
                immuConfig:pre.immuConfig.set("checked",dom.checked)
            };
        });
    }`;
    
    export const str3 = `searchHandle=(keyword:string,field:string)=>{
    console.log(keyword,field);
  }
  closeHandle=(field:string)=>{
    console.log(field);
    
  }`

  export const str4 = ` matchValFn=(value?:string)=>{
        return !value || value.includes("验证");
    }`

    