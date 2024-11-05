import { NotifyType, CommentType } from "./type"

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
  if (interval) {
    const count = Math.floor(seconds / interval.seconds);
    return `${count} ${interval.label}${count !== 1 ? 's' : ''}`;
  }
  return 'now'
}


export const convertToNested = (comments: CommentType[]) => {
  const res: CommentType[] = []
  const addChildToComment = (comments: CommentType[], parents: string[], newChild: CommentType): boolean => {
    for (const comment of comments) {
      if (
        comment.parents.length === parents.length &&
        comment.parents.every((parent, index) => parent === parents[index])
      ) {
        comment.child.push(newChild);
        return true;
      }

      if (addChildToComment(comment.child, parents, newChild)) {
        return true;
      }
    }
    return false;
  };
  if (comments.length > 0) {
    comments.map(comment => {
      if (comment.parents.length === 1) {
        res.push(comment)
      }
      else if (comment.parents.length > 1) {
        const tmp: string[] = JSON.parse(JSON.stringify(comment.parents))
        tmp.pop()
        addChildToComment(res, tmp, comment);
      }
    })
  }
  return res
}
