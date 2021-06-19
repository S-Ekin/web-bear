/**
 * @author: SEKin
 * @Date: 2021-06-19 09:05:53
 * @description:
 * @Last Modified time: 2021-06-19 09:05:53
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input, CheckBox, FileInp} from "@component/input/index";
import { Button } from "@component/button";
type inputConfig = {
  dataSet:string;
  disabled:boolean;
  hasFiles:{id:string, text:string}[];
  hasFilesTextField:string;
  hasFilesIdField:string;
  name:string;
  width:number;
  multiply:boolean;
  className:string;
  norequire:boolean ;
  fileTypeMatch:string;
};
type Props={

};
type States={
  immuConfig:IImmutalbeMap<inputConfig>;
  ableMatch: boolean;
};
const inputConfig:inputConfig = {
  dataSet: "",
  hasFilesIdField: "id",
  hasFilesTextField: "text",
  multiply: false,
  fileTypeMatch: "",
  hasFiles: [
    {id: "1", text: "asdf.ts"},
    {id: "2", text: "打法撒旦.txt"},
  ],
  name: "",
  width: 0,
  norequire: false,
  className: "",
  disabled: false
};
class Demo extends React.PureComponent<Props, States> {


  state:States={
    immuConfig: createImmutableMap(inputConfig),
    ableMatch: false,
  };
  getFiles:  null | (()=>{
    upFiles: File[],
    hasFile: {id:string;text:string}[],
  }) = null;
  bindGetFiles=(fn:this["getFiles"]) => {
    this.getFiles = fn;
  }
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof inputConfig;
    let value: string | number |boolean = dom.value;
    if (name === "width") {
      value = ~~value;
    } else if (name === "norequire" || name === "disabled" || name === "multiply") {
      value = value === "1";
    }
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }
  btnOpt=(e:React.MouseEvent<HTMLButtonElement>) => {
    const dom = e.currentTarget;
    const name = dom.name;
    if (name === "getFile") {
      const files = this.getFiles!();
      console.log(files);
    }

  }
  fileChange=(fileList:IImmutalbeList<{id:number;file:File}>) => {
    console.log(fileList.get(0)!.file);
  }
  render () {
    const {immuConfig} = this.state;
    const { width, name, dataSet, className, norequire, disabled, fileTypeMatch, multiply, hasFiles } = immuConfig.toJS();
    return (
      <Layout tit="文件上传">
        <div className="g-item-show">
          <div className="inp-item">
            <FileInp
              width={width}
              name={name}
              fileTypeMatch={fileTypeMatch}
              hasFiles={hasFiles}
              dataSet={dataSet}
              disabled={disabled}
              changeFn={this.fileChange}
              bindGetUpAndHasFiles={this.bindGetFiles}
              norequire={norequire}
              className={className}
              multiply={multiply}
            >
                  附件：
            </FileInp>
          </div>
          <div className="flex-between">
            <div>
              <div className="inp-item">
                <Input
                  name="width"
                  norequire
                  changeFn={this.changeConfig}
                  value={`${width}`}
                >
                      上传的文件容器 width：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  width={280}
                  name="fileTypeMatch"
                  value={fileTypeMatch}
                  changeFn={this.changeConfig}
                >
                    文件类型限制 fileTypeMatch：
                </Input>
              </div>

              <div className="inp-item">
                <span>禁用 disabled：</span>
                <CheckBox
                  name="disabled"
                  value="1"
                  type="radio"
                  checked={disabled}
                  changeHandle={this.changeConfig}
                >
                      是
                </CheckBox>
                <CheckBox
                  name="disabled"
                  value="2"
                  type="radio"
                  checked={!disabled}
                  changeHandle={this.changeConfig}
                >
                      否
                </CheckBox>
              </div>
              <div className="inp-item">
                <Input
                  name="dataSet"
                  norequire
                  changeFn={this.changeConfig}
                  value={dataSet}
                >
                     数据 dataSet：
                </Input>
              </div>
            </div>
            <div>
              <div className="inp-item">
                <Input
                  name="name"
                  norequire
                  changeFn={this.changeConfig}
                  value={name}
                >
                      字段 name：
                </Input>
              </div>
              <div className="inp-item">
                <span>多文件 multiply：</span>
                <CheckBox
                  name="multiply"
                  value="1"
                  type="radio"
                  checked={multiply}
                  changeHandle={this.changeConfig}
                >
                      多选
                </CheckBox>
                <CheckBox
                  name="multiply"
                  value="2"
                  type="radio"
                  checked={!multiply}
                  changeHandle={this.changeConfig}
                >
                      单选
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>样式 className：</span>
                <Input
                  name="className"
                  value={className}
                  norequire
                  changeFn={this.changeConfig}
                >
                      样式名称：
                </Input>
              </div>
              <div className="inp-item">
                <span>不是必填 norequire：</span>
                <CheckBox
                  name="norequire"
                  value="1"
                  type="radio"
                  checked={norequire}
                  changeHandle={this.changeConfig}
                >
                      是
                </CheckBox>
                <CheckBox
                  name="norequire"
                  value="2"
                  type="radio"
                  checked={!norequire}
                  changeHandle={this.changeConfig}
                >
                      否
                </CheckBox>
              </div>
            </div>
          </div>
          <div className="g-item-show">
            <Button handle={this.btnOpt} name="getFile">获取上传的文件和已经有的文件</Button>
          </div>
        </div>
      </Layout>
    );
  }
}


export default Demo;
