import CommentComponent from './components/Comment.js';
import Comment from './core/Comment.js';
import { getNow } from './utils/getNow.js';
class SubmitForm {
    constructor(formId, mainCommentContainerId, commentElement = '', userImg = '', userName = '', commentText = '', commentDate = '', comments = [], commentElements = '', load = false) {
        this.formId = formId;
        this.mainCommentContainerId = mainCommentContainerId;
        this.commentElement = commentElement;
        this.userImg = userImg;
        this.userName = userName;
        this.commentText = commentText;
        this.commentDate = commentDate;
        this.comments = comments;
        this.commentElements = commentElements;
        this.load = load;
        this.commentService = new Comment();
        this.formId = formId;
        this.mainCommentContainerId = mainCommentContainerId;
        this.commentElement = commentElement;
        this.userImg = userImg;
        this.userName = userName;
        this.commentText = commentText;
        this.commentDate = commentDate;
        this.comments = comments;
        this.commentElements = commentElements;
        this.commentService.init();
        this.load = false;
    }
    async getData(e) {
        if (this.load) {
            return;
        }
        this.load = true;
        const form = e.target;
        form.removeAttribute('data-error');
        const data = new FormData(form);
        const get = (n) => data.get(n);
        let avatar = '';
        await this._getAvatar(get('name') || 'Имя')
            .then((r) => {
            avatar = r.url;
        })
            .catch((e) => {
            console.error(e);
        });
        const name = get('name') || 'Имя', text = get('comment'), date = getNow();
        if (text.length > 1000) {
            form.dataset.error = 'true';
            return;
        }
        this.userImg = avatar;
        this.userName = name;
        this.commentText = text;
        this.commentDate = date;
        this.commentService.add({
            name,
            date,
            avatar,
            rate: 0,
            text,
            isLiked: false,
        });
        this.load = false;
    }
    _getAvatar(name) {
        return fetch(`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`);
    }
    addEvent() {
        const mainSubmitForm = document.getElementById(this.formId);
        const sortFromToBtn = document.querySelector('.comments__sort-button');
        const filterBtns = document.querySelectorAll('.js-filter-btn');
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filterName = btn.dataset.filter;
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    this.commentService.filter.off(filterName);
                }
                else {
                    btn.classList.add('active');
                    this.commentService.filter.on(filterName);
                }
                this.postComment();
            });
        });
        sortFromToBtn.onclick = () => {
            this.commentService.filter.setIsFromBigToSmall(sortFromToBtn.classList.contains('active'));
            sortFromToBtn.classList.toggle('active');
            this.postComment();
        };
        this.postComment();
        mainSubmitForm === null || mainSubmitForm === void 0 ? void 0 : mainSubmitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.getData(e);
            this.postComment();
            const form = e.target;
            const area = form.querySelector('textarea');
            form.reset();
            autoExpand(area);
            displayTextLimit(area);
        });
    }
    updateEvents() {
        const likeBtns = document.querySelectorAll('.js-like-comment');
        const actionBtns = document.querySelectorAll('.js-rate-btn');
        const answearForms = document.querySelectorAll('.js-answer-form');
        likeBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const target = btn;
                const isLiked = target.dataset.liked === 'true';
                const id = target.dataset.comment;
                this.commentService.setLike(id, !isLiked);
                this.postComment();
            });
        });
        actionBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.comment;
                const action = btn.dataset.action;
                this.commentService.setRate(id, action);
                this.postComment();
            });
        });
        answearForms.forEach((aForm) => {
            const area = aForm.querySelector('textarea');
            area.addEventListener('input', function () {
                autoExpand(area, aForm.querySelector('.comments__add-comment-button'));
                displayTextLimit(area, aForm.querySelector('.comments__add-comment-txt-limit'));
            });
            aForm.onsubmit = async (e) => {
                e.preventDefault();
                const id = aForm.dataset.id;
                const data = new FormData(aForm);
                const get = (n) => data.get(n);
                const name = get('name') || 'Имя';
                let avatar = '';
                await this._getAvatar(name).then((r) => {
                    avatar = r.url;
                });
                this.commentService.add({
                    rate: 0,
                    avatar,
                    date: getNow(),
                    isLiked: false,
                    name,
                    answerFor: id,
                    text: get('comment'),
                });
                area.value = '';
                aForm.classList.remove('active');
                this.postComment();
            };
        });
    }
    postComment() {
        this.commentElements = '';
        const mainCommentContainer = document.querySelector(this.mainCommentContainerId);
        this._fillElements();
        mainCommentContainer.innerHTML = this.commentElements;
        this.updateEvents();
    }
    _fillElements() {
        const _comments = this.commentService.getComment();
        const comments = this.commentService.filter
            .getActivadetFilter()
            .reduce((acc, name) => this.commentService.filter[name](acc), _comments);
        const topLevelComment = comments.filter((c) => !c.answerFor);
        this.commentService.setTotal(topLevelComment.length);
        topLevelComment.forEach((comment) => {
            const commentElement = CommentComponent(comment, comments.filter((c) => c.answerFor === comment.id));
            this.commentElements += commentElement;
        });
        return this.commentElements;
    }
}
const mainCommentsForm = new SubmitForm('addCommentForm', '.comments__display-container');
mainCommentsForm.addEvent();
const button = document.querySelector('.comments__select-button');
const form = document.querySelector('.comments__select-menu');
const filters = document.querySelectorAll('.comments__select-option');
const buttonClick = () => {
    button === null || button === void 0 ? void 0 : button.classList.toggle('active');
    form === null || form === void 0 ? void 0 : form.classList.toggle('comments__select-menu_state_displayed');
};
if (button != null && form != null) {
    button.addEventListener('click', buttonClick);
}
filters.forEach((filter) => {
    filter.onclick = () => {
        buttonClick();
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const span = button === null || button === void 0 ? void 0 : button.querySelector('span');
        span.innerText = filter.innerHTML;
    };
});
window.showReply = (elem) => {
    var _a, _b, _c;
    (_c = (_b = (_a = elem.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.nextElementSibling) === null || _c === void 0 ? void 0 : _c.classList.toggle('active');
};
function autoExpand(textarea, btn) {
    const submitButton = btn || document.querySelector('.comments__add-comment-button');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    if (textarea.value.length > 0) {
        submitButton.classList.remove('comments__add-comment-button_type_disabled');
        submitButton.removeAttribute('disabled');
        submitButton.classList.add('comments__add-comment-button_type_enabled');
    }
    else if (textarea.value.length === 0 || textarea.value.length > 1000) {
        submitButton.classList.remove('comments__add-comment-button_type_enabled');
        submitButton.setAttribute('disabled', '');
        submitButton.classList.add('comments__add-comment-button_type_disabled');
    }
}
function displayTextLimit(textarea, displayarea) {
    const textareaInfo = displayarea || document.querySelector(".comments__add-comment-txt-limit");
    if (textarea.value.length > 0) {
        textareaInfo.textContent = `${textarea.value.length}/1000`;
    }
    else {
        textareaInfo.textContent = `Макс. 1000 символов`;
    }
}
const addCommentForm = document.getElementById('addCommentForm');
const addCommentTextarea = addCommentForm.querySelector('.comments__add-comment-textarea');
addCommentTextarea.addEventListener('input', function () {
    autoExpand(addCommentTextarea);
    displayTextLimit(addCommentTextarea);
});
//# sourceMappingURL=main.js.map