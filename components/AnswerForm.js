export default function AnswerForm(props) {
    const { id } = props;
    return ` 
    <form class="comments__add-comment-form answer js-answer-form" name="comment" data-id="${id}" >
          <img class="comments__user-img" src="./Images/user_photo_1.jpg" alt="фото пользователя">
          <input class="comments__user-name" name="name" placeholder="Имя Пользователя" />
          <p class="comments__add-comment-txt-limit">Макс. 1000 символов</p>
          <p class="comments__add-comment-error-msg">Слишком длинное сообщение</p>
          <textarea class="comments__add-comment-textarea" name="comment" id="addComment"
            placeholder="Введите текст сообщения..." maxlength="1000" rows="1"></textarea>
          <button class="comments__add-comment-button comments__add-comment-button_type_disabled"
            disabled>Отправить</button>
        </form>
  `;
}
//# sourceMappingURL=AnswerForm.js.map