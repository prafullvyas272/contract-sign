import { LogType } from '@/utils/typeEnum';
import {
    FileText,
    Signature,
    ArrowDownCircle,
    ArrowUpCircle,
    FileQuestion
  } from 'lucide-react';
  

  
  interface LogIconProps {
    type: LogType;
    className?: string;
  }
  
  const LogIcon = ({ type, className = 'h-5 w-5' }: LogIconProps) => {
    const iconMap = {
      [LogType.ContractCreated]: <FileText className={className} />,
      [LogType.Signature]: <Signature className={className} />,
      [LogType.AmountDebit]: <ArrowDownCircle className={className} />,
      [LogType.AmountCredit]: <ArrowUpCircle className={className} />,
    };
  
    return iconMap[type] || <FileQuestion className={className} />;
  };
  
  export default LogIcon;