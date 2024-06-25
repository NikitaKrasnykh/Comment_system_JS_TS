export default class CommentFilterImpl {
    constructor(_root) {
        this._root = _root;
        this._isFromBigToSmall = true;
        this._activatedFilter = ['quantityRate'];
    }
    getActivadetFilter() {
        return this._activatedFilter;
    }
    on(filter) {
        this._activatedFilter = [...this._activatedFilter, filter];
    }
    off(filter) {
        const index = this._activatedFilter.indexOf(filter);
        const newFilters = [...this._activatedFilter];
        newFilters.splice(index, 1);
        this._activatedFilter = newFilters;
    }
    isFromBigToSmall() {
        return this._isFromBigToSmall;
    }
    setIsFromBigToSmall(v) {
        this._isFromBigToSmall = v;
    }
    like(arr) {
        return arr.filter((c) => c.isLiked);
    }
    date(arr) {
        return arr.sort((a, b) => {
            const aDate = Date.parse(new Date(a.date).toISOString());
            const bDate = Date.parse(new Date(b.date).toISOString());
            if (this._isFromBigToSmall) {
                return aDate > bDate ? -1 : 1;
            }
            else {
                return aDate > bDate ? 1 : -1;
            }
        });
    }
    quantityAnswer(arr) {
        return arr.sort((a, b) => {
            const all = this._root.getComment();
            const aLength = all.filter((c) => c.answerFor === a.id).length;
            const bLength = all.filter((c) => c.answerFor === b.id).length;
            if (this._isFromBigToSmall) {
                return aLength > bLength ? -1 : 1;
            }
            else {
                return aLength > bLength ? 1 : -1;
            }
        });
    }
    quantityRate(arr) {
        return arr.sort((a, b) => {
            if (this._isFromBigToSmall) {
                return a.rate > b.rate ? -1 : 1;
            }
            else {
                return a.rate > b.rate ? 1 : -1;
            }
        });
    }
}
//# sourceMappingURL=CommentFilter.js.map