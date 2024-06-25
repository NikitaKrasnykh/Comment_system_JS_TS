import CommentComponent from './components/Comment.js';
import Comment from './core/Comment.js';
import { FilterName } from './core/CommentFilter.js';
import { RateAction } from './core/types.js';
import { getNow } from './utils/getNow.js';

interface commentsData {
  userImg: string;
  userName: string;
  commentText: string;
  commentDate: number;
}

class SubmitForm {
  commentService = new Comment();
  constructor(
    public formId: string,
    public mainCommentContainerId: string,
    public commentElement: string = '',
    public userImg: string = '',
    public userName: string = '',
    public commentText: string = '',
    public commentDate: string = '',
    public comments: commentsData[] = [],
    public commentElements: string = '',
    public load = false,
  ) {
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

  async getData(e: SubmitEvent) {
    if (this.load) {
      return;
    }
    this.load = true;
    const form = e.target as HTMLFormElement;
    form.removeAttribute('data-error');
    const data = new FormData(form);
    const get = (n: string) => data.get(n) as string;
    let avatar = '';
    await this._getAvatar(get('name') || 'Имя')
      .then((r) => {
        avatar = r.url;
      })
      .catch((e) => {
        console.error(e);
      });
    const name = get('name') || 'Имя',
      text = get('comment'),
      date = getNow();
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

  private _getAvatar(name: string): Promise<{ url: string }> {
    return fetch(`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`);
  }

  addEvent() {
    const mainSubmitForm = document.getElementById(this.formId);
    const sortFromToBtn = document.querySelector<HTMLButtonElement>('.comments__sort-button')!;
    const filterBtns = document.querySelectorAll<HTMLDivElement>('.js-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterName = btn.dataset.filter as FilterName;
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          this.commentService.filter.off(filterName);
        } else {
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
    mainSubmitForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.getData(e);
      this.postComment();
      const form = e.target as HTMLFormElement;
      const area = form.querySelector('textarea')!;
      form.reset();
      autoExpand(area);
      displayTextLimit(area);
    });
  }

  updateEvents() {
    const likeBtns = document.querySelectorAll<HTMLButtonElement>('.js-like-comment');
    const actionBtns = document.querySelectorAll<HTMLButtonElement>('.js-rate-btn');
    const answearForms = document.querySelectorAll<HTMLFormElement>('.js-answer-form');
    likeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn;
        const isLiked = target.dataset.liked === 'true';
        const id = target.dataset.comment!;
        this.commentService.setLike(id, !isLiked);
        this.postComment();
      });
    });

    actionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.comment!;
        const action = btn.dataset.action as RateAction;
        this.commentService.setRate(id, action);
        this.postComment();
      });
    });
    answearForms.forEach((aForm) => {
      const area = aForm.querySelector('textarea')!;
      area.addEventListener('input', function () {
        autoExpand(area, aForm.querySelector<HTMLButtonElement>('.comments__add-comment-button')!);
        displayTextLimit(area, aForm.querySelector<HTMLElement>('.comments__add-comment-txt-limit')!)
      });
      aForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = aForm.dataset.id;
        const data = new FormData(aForm);
        const get = (n: string) => data.get(n) as string;
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
    const mainCommentContainer: HTMLElement = document.querySelector(this.mainCommentContainerId) as HTMLElement;
    this._fillElements();
    mainCommentContainer.innerHTML = this.commentElements;
    this.updateEvents();
  }

  private _fillElements() {
    const _comments = this.commentService.getComment();
    const comments = this.commentService.filter
      .getActivadetFilter()
      .reduce((acc, name) => this.commentService.filter[name](acc), _comments);
    const topLevelComment = comments.filter((c) => !c.answerFor);
    this.commentService.setTotal(topLevelComment.length);
    topLevelComment.forEach((comment) => {
      const commentElement = CommentComponent(
        comment,
        comments.filter((c) => c.answerFor === comment.id),
      );
      this.commentElements += commentElement;
    });
    return this.commentElements;
  }
}

const mainCommentsForm = new SubmitForm('addCommentForm', '.comments__display-container');
mainCommentsForm.addEvent();

const button = document.querySelector<HTMLButtonElement>('.comments__select-button');
const form = document.querySelector<HTMLFormElement>('.comments__select-menu');
const filters = document.querySelectorAll<HTMLDivElement>('.comments__select-option');
const buttonClick = () => {
  button?.classList.toggle('active');
  form?.classList.toggle('comments__select-menu_state_displayed');
};
if (button != null && form != null) {
  button.addEventListener('click', buttonClick);
}

filters.forEach((filter) => {
  filter.onclick = () => {
    buttonClick();
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const span = button?.querySelector('span')!;
    span.innerText = filter.innerHTML;
  };
});

window.showReply = (elem: HTMLButtonElement) => {
  elem.parentElement?.parentElement?.nextElementSibling?.classList.toggle('active');
};

function autoExpand(textarea: HTMLTextAreaElement, btn?: HTMLButtonElement) {
  const submitButton: HTMLButtonElement =
    btn || (document.querySelector('.comments__add-comment-button') as HTMLButtonElement);
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  if (textarea.value.length > 0) {
    submitButton.classList.remove('comments__add-comment-button_type_disabled');
    submitButton.removeAttribute('disabled');
    submitButton.classList.add('comments__add-comment-button_type_enabled');
  } else if (textarea.value.length === 0 || textarea.value.length > 1000) {
    submitButton.classList.remove('comments__add-comment-button_type_enabled');
    submitButton.setAttribute('disabled', '');
    submitButton.classList.add('comments__add-comment-button_type_disabled');
  }
}

function displayTextLimit(textarea: HTMLTextAreaElement, displayarea?: HTMLElement) {
  const textareaInfo = 
    displayarea || document.querySelector(".comments__add-comment-txt-limit") as HTMLElement;
  if (textarea.value.length > 0) {
      textareaInfo.textContent = `${textarea.value.length}/1000`
  } else {
      textareaInfo.textContent = `Макс. 1000 символов`
  }
}

const addCommentForm = document.getElementById('addCommentForm') as HTMLFormElement;
const addCommentTextarea = addCommentForm.querySelector<HTMLTextAreaElement>('.comments__add-comment-textarea')!;

addCommentTextarea.addEventListener('input', function () {
  autoExpand(addCommentTextarea);
  displayTextLimit(addCommentTextarea);
});
