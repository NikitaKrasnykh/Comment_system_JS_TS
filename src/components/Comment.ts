import { CommentItem } from '../core/types.js';
import AnswerForm from './AnswerForm.js';
import ReplyComment from './Replay.js';

export default function CommentComponent(comment: CommentItem, replyes: CommentItem[]) {
  return `
  <div class="comments__display-container">
  <div class="comments__main-comment">
      <img class="comments__user-img" src="${comment.avatar}" alt="фото пользователя">
      <p class="comments__user-name">${comment.name}</p>
      <p class="comments__date">${comment.date}</p>
      <p class="comments__comment-txt">${comment.text}</p>
      <div class="comments__comment-panel">
        <button class="comments__comment-btn" onclick="window.showReply(this)" type="button">
          <img class="comments__comment-reply-img" src="./Images/reply_button.png" alt="кнопка ответа на главный комментарий">
          Ответить
        </button>
        <button class="comments__comment-btn js-like-comment" type="button" data-liked="${
          comment.isLiked
        }" data-comment="${comment.id}">
          <img class="comments__comment-fav-img" src="${
            comment.isLiked ? './Images/fav_button_selected.png' : './Images/fav_button_unselected.png'
          }" alt="в избранное">
          В избранное
        </button>
        <div class="comments__likes-container">
          <button class="comments__likes-btn js-rate-btn"  data-action="minus" data-comment="${comment.id}">
            <img class="comments__likes-btn-img" src="./Images/minus_img.png" alt="">
          </button>
          <p class="comments__likes-number">${comment.rate}</p>
          <button class="comments__likes-btn js-rate-btn" data-action="plus" data-comment="${comment.id}">
            <img class="comments__likes-btn-img" src="./Images/plus_img.png" alt="">
          </button>
        </div>
      </div>
      </div>
      ${AnswerForm({ id: comment.id })}
      <div class="comments__reply-container">${replyes
        .map((r) => ReplyComment({ ...r, answearName: comment.name }))
        .join('')}</div>
      </div>
      `;
}
