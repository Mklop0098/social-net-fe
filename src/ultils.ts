import { NotifyType } from "./type"

export const haveUnreadNotify = (notifies: NotifyType[]) => {
    const unread = notifies.find(notify => notify.readed === false)
    return !!unread
}


  
  
  export const timeAgo = (date: Date) => {
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
      ];

      const b = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
      const c = new Date(date).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    
    const seconds = Math.floor((new Date(b).getTime() - new Date(c).getTime()) / 1000);
    const interval = intervals.find(i => i.seconds < seconds);
    if(interval) {
        const count = Math.floor(seconds / interval.seconds);
        return `${count} ${interval.label}${count !== 1 ? 's' : ''}`;
    }
    return 'now'
  }
