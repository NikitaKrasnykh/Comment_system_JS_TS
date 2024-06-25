import Comment from './Comment.js';
import { CommentItem } from './types.js';

export interface CommentFilter {
  like: (arr: CommentItem[]) => CommentItem[];
  date: (arr: CommentItem[]) => CommentItem[];
  quantityRate: (arr: CommentItem[]) => CommentItem[];
  quantityAnswer: (arr: CommentItem[]) => CommentItem[];
}

export type FilterName = keyof CommentFilter;

export default class CommentFilterImpl implements CommentFilter {
  private _isFromBigToSmall = true;

  private _activatedFilter: FilterName[] = ['quantityRate'];

  constructor(protected readonly _root: Comment) {}

  getActivadetFilter() {
    return this._activatedFilter;
  }

  on(filter: FilterName) {
    this._activatedFilter = [...this._activatedFilter, filter];
  }

  off(filter: FilterName) {
    const index = this._activatedFilter.indexOf(filter);
    const newFilters = [...this._activatedFilter];
    newFilters.splice(index, 1);
    this._activatedFilter = newFilters;
  }

  isFromBigToSmall() {
    return this._isFromBigToSmall;
  }

  setIsFromBigToSmall(v: boolean) {
    this._isFromBigToSmall = v;
  }

  like(arr: CommentItem[]) {
    return arr.filter((c) => c.isLiked);
  }

  date(arr: CommentItem[]) {
    return arr.sort((a, b) => {
      const aDate = Date.parse(new Date(a.date).toISOString());
      const bDate = Date.parse(new Date(b.date).toISOString());
      if (this._isFromBigToSmall) {
        return aDate > bDate ? -1 : 1;
      } else {
        return aDate > bDate ? 1 : -1;
      }
    });
  }

  quantityAnswer(arr: CommentItem[]) {
    return arr.sort((a, b) => {
      const all = this._root.getComment();
      const aLength = all.filter((c) => c.answerFor === a.id).length;
      const bLength = all.filter((c) => c.answerFor === b.id).length;
      if (this._isFromBigToSmall) {
        return aLength > bLength ? -1 : 1;
      } else {
        return aLength > bLength ? 1 : -1;
      }
    });
  }

  quantityRate(arr: CommentItem[]) {
    return arr.sort((a, b) => {
      if (this._isFromBigToSmall) {
        return a.rate > b.rate ? -1 : 1;
      } else {
        return a.rate > b.rate ? 1 : -1;
      }
    });
  }
}
