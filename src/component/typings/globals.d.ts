interface NodeModule {
  hot : {
    accept(path?: string, callback?: () => void): void
  }
}
interface AnyObj{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k:string]:any;
}
