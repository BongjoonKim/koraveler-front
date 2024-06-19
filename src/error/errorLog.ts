export interface errorLogsProps {
  status: number;
  location: string;
  
  message: {
    title : string;
    content : string;
    data : any
  }
  
}

export const errorLogs = (e?: any, func?: Function, props ?: errorLogsProps) => {
  return console.log(`${func} error`, e)
}