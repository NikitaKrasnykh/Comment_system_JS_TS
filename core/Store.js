const KEY = 'store';
export class Store {
    add(field, value) {
        const _store = localStorage.getItem(KEY);
        const store = JSON.parse(_store || '{}');
        localStorage.setItem(KEY, JSON.stringify(Object.assign(store, { [field]: value })));
    }
    getOne(field) {
        const store = JSON.parse(localStorage.getItem(KEY) || this._getInitialStore());
        return store[field];
    }
    getAll() {
        const store = JSON.parse(localStorage.getItem(KEY) || this._getInitialStore());
        return store;
    }
    remove(field) {
        const store = JSON.parse(localStorage.getItem(KEY) || this._getInitialStore());
        delete store[field];
        localStorage.setItem(KEY, JSON.stringify(store));
    }
    _getInitialStore() {
        return JSON.stringify({
            comment: [],
        });
    }
}
//# sourceMappingURL=Store.js.map