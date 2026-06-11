// comments.types.ts
export interface CommentItem {
  id:          number
  studentName: string
  initials:    string
  color:       string
  date:        string
  text:        string
  subject:     string
  is_read:     boolean
}

export interface CommentsResponse {
  total:    number
  read:     number
  unread:   number
  comments: CommentItem[]
}