import CommentFilterImpl from './CommentFilter.js';
import { Store } from './Store.js';
export default class Comment {
    constructor() {
        this.store = new Store();
        this.filter = new CommentFilterImpl(this);
    }
    add(comment) {
        const oldComment = this.getComment();
        oldComment.unshift({
            id: (oldComment.length + 1).toString(),
            ...comment,
        });
        this.store.add('comment', oldComment);
    }
    setLike(id, isLiked) {
        const _store = this.getComment();
        this.store.add('comment', _store.map((c) => {
            if (c.id === id) {
                return {
                    ...c,
                    isLiked,
                };
            }
            return c;
        }));
    }
    setTotal(num) {
        const el = document.querySelector('.js-comment-total');
        el.textContent = (num === null || num === void 0 ? void 0 : num.toString()) || this.getComment().length.toString();
    }
    setRate(id, action) {
        const _store = this.getComment();
        let rate = 0;
        const d = this.store.getOne('disliked') || [];
        const l = this.store.getOne('liked') || [];
        const isLiked = l.includes(id);
        const isDisLiked = d.includes(id);
        const addToLiked = (idPlus) => {
            const disliked = this.store.getOne('disliked') || [];
            const liked = this.store.getOne('liked') || [];
            this.store.add('liked', [...liked, idPlus]);
            const index = disliked.indexOf(idPlus);
            index >= 0 && disliked.splice(index, 1);
            this.store.add('disliked', [...disliked]);
        };
        const addToDisLiked = (idMinus) => {
            const disliked = this.store.getOne('disliked') || [];
            const liked = this.store.getOne('liked') || [];
            this.store.add('disliked', [...disliked, idMinus]);
            const index = liked.indexOf(idMinus);
            index >= 0 && liked.splice(index, 1);
            this.store.add('liked', [...liked]);
        };
        const clear = (id) => {
            const disliked = this.store.getOne('disliked') || [];
            const liked = this.store.getOne('liked') || [];
            const dIndex = disliked.indexOf(id);
            dIndex >= 0 && disliked.splice(dIndex, 1);
            this.store.add('disliked', [...disliked]);
            const lIndex = liked.indexOf(id);
            lIndex >= 0 && liked.splice(lIndex, 1);
            this.store.add('liked', [...liked]);
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
        this.store.add('comment', _store.map((c) => {
            if (c.id === id) {
                return {
                    ...c,
                    rate: c.rate + rate,
                };
            }
            return c;
        }));
    }
    getComment() {
        return this.store.getOne('comment');
    }
    init() {
        this.setTotal();
    }
}
//# sourceMappingURL=Comment.js.map