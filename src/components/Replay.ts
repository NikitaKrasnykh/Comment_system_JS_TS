import { CommentItem } from '../core/types.js';

export default function ReplyComment(comment: CommentItem & { answearName: string }) {
  return `
    <div class="comments__reply">
        <img class="comments__user-img" src="${comment.avatar}" alt="фото пользователя" />
        <p class="comments__user-name">${comment.name}</p>
        <div class="comments__reply-user-info">
          <img class="comments__reply-user-info-img" src="./Images/reply_button.png" alt="" />
          <p class="comments__reply-user-info-name">${comment.answearName}</p>
        </div>
        <p class="comments__date">${comment.date}</p>
        <p class="comments__comment-txt">
          ${comment.text}
        </p>
        <div class="comments__comment-panel">
          <button class="comments__comment-btn comments__comment-btn_txt_l js-like-comment" data-liked="${
            comment.isLiked
          }" data-comment="${comment.id}" type="button">
            <img
              class="comments__comment-fav-img comments__comment-fav-img_size_l"
              src="${comment.isLiked ? './Images/fav_button_selected.png' : './Images/fav_button_unselected.png'}"
              alt="в избранное"
            />
            В избранное
          </button>
          <div class="comments__likes-container">
            <button class="comments__likes-btn js-rate-btn" data-action="minus" data-comment="${comment.id}">
              <img class="comments__likes-btn-img" src="./Images/minus_img.png" alt="" />
            </button>
            <p class="comments__likes-number">${comment.rate}</p>
            <button class="comments__likes-btn js-rate-btn" data-action="plus" data-comment="${comment.id}">
              <img class="comments__likes-btn-img" src="./Images/plus_img.png" alt="" />
            </button>
          </div>
        </div>
      </div>
        `;
}
