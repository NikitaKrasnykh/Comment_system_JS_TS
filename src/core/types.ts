export type CommentItem = {
  id: string;
  name: string;
  date: string;
  avatar: string;
  text: string;
  isLiked: boolean;
  rate: number;
  answerFor?: string;
};


export type RateAction = 'plus' | 'minus'
