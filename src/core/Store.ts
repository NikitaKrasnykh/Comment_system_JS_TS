import { CommentItem } from './types.js';

const KEY = 'store';

export interface CommentStore {
  comment: CommentItem[];
  liked: string[];
  disliked: string[];
}

export class Store {
  add<T>(field: keyof CommentStore, value: T | string) {
    const _store = localStorage.getItem(KEY);
    const store = JSON.parse(_store || '{}');
    localStorage.setItem(KEY, JSON.stringify(Object.assign(store, { [field]: value })));
  }

  getOne<T>(field: keyof CommentStore) {
    const store = JSON.parse(localStorage.getItem(KEY) || this._getInitialStore());
    return store[field] as T;
  }

  getAll() {
    const store = JSON.parse(localStorage.getItem(KEY) || this._getInitialStore());
    return store as CommentStore;
  }

  remove(field: string) {
    const store = JSON.parse(localStorage.getItem(KEY) || this._getInitialStore());
    delete store[field];
    localStorage.setItem(KEY, JSON.stringify(store));
  }

  private _getInitialStore() {
    return JSON.stringify({
      comment: [],
    });
  }
}
