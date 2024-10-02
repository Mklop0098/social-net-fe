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
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    const interval = intervals.find(i => i.seconds < seconds);
    if(interval) {
        const count = Math.floor(seconds / interval.seconds);
        return `${count} ${interval.label}${count !== 1 ? 's' : ''}`;
    }
    return 'now'
  }