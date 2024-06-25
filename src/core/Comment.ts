import CommentFilterImpl from './CommentFilter.js';
import { Store } from './Store.js';
import { CommentItem, RateAction } from './types.js';

export default class Comment {
  store: Store;
  filter: CommentFilterImpl;
  constructor() {
    this.store = new Store();
    this.filter = new CommentFilterImpl(this);
  }
  add(comment: Omit<CommentItem, 'id'>) {
    const oldComment = this.getComment();
    oldComment.unshift({
      id: (oldComment.length + 1).toString(),
      ...comment,
    });
    this.store.add('comment', oldComment);
  }

  setLike(id: string, isLiked: boolean) {
    const _store = this.getComment();
    this.store.add(
      'comment',
      _store.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isLiked,
          };
        }
        return c;
      }),
    );
  }

  setTotal(num?: number) {
    const el = document.querySelector('.js-comment-total')!;
    el.textContent = num?.toString() || this.getComment().length.toString();
  }

  setRate(id: string, action: RateAction) {
    const _store = this.getComment();
    let rate = 0;
    const d = this.store.getOne<string[]>('disliked') || [];
    const l = this.store.getOne<string[]>('liked') || [];
    const isLiked = l.includes(id);
    const isDisLiked = d.includes(id);
    const addToLiked = (idPlus: string) => {
      const disliked = this.store.getOne<string[]>('disliked') || [];
      const liked = this.store.getOne<string[]>('liked') || [];
      this.store.add<string[]>('liked', [...liked, idPlus]);
      const index = disliked.indexOf(idPlus);
      index >= 0 && disliked.splice(index, 1);
      this.store.add<string[]>('disliked', [...disliked]);
    };
    const addToDisLiked = (idMinus: string) => {
      const disliked = this.store.getOne<string[]>('disliked') || [];
      const liked = this.store.getOne<string[]>('liked') || [];
      this.store.add<string[]>('disliked', [...disliked, idMinus]);
      const index = liked.indexOf(idMinus);
      index >= 0 && liked.splice(index, 1);
      this.store.add<string[]>('liked', [...liked]);
    };

    const clear = (id: string) => {
      const disliked = this.store.getOne<string[]>('disliked') || [];
      const liked = this.store.getOne<string[]>('liked') || [];
      const dIndex = disliked.indexOf(id);
      dIndex >= 0 && disliked.splice(dIndex, 1);
      this.store.add<string[]>('disliked', [...disliked]);
      const lIndex = liked.indexOf(id);
      lIndex >= 0 && liked.splice(lIndex, 1);
      this.store.add<string[]>('liked', [...liked]);
    };

    if (isLiked && action === 'minus') {
      rate = -1;
      clear(id);
    }

    if (isDisLiked && action === 'plus') {
      rate = 1;
      clear(id);
    }

    if (!isDisLiked && !isLiked) {
      if (action === 'minus') {
        rate = -1;
        addToDisLiked(id);
      }

      if (action === 'plus') {
        rate = 1;
        addToLiked(id);
      }
    }

    this.store.add(
      'comment',
      _store.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            rate: c.rate + rate,
          };
        }

        return c;
      }),
    );
  }

  getComment() {
    return this.store.getOne<CommentItem[]>('comment');
  }

  init() {
    this.setTotal();
  }
}
