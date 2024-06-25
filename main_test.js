const button = document.querySelector(".comments__select-button");
const form = document.querySelector(".comments__select-menu");

button.addEventListener("click", () => {
    console.log("Clicked");
    form.classList.toggle("comments__select-menu_state_displayed");
});

function autoExpand(textarea) {
    const button_1 = document.querySelector(".comments__add-comment-button");
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    console.log(textarea.value.length);
    if (textarea.value.length > 0) {

        button_1.classList.remove("comments__add-comment-button_type_disabled");
        button_1.removeAttribute("disabled");
        button_1.classList.add("comments__add-comment-button_type_enabled");
    } else if (textarea.value.length === 0 || textarea.value.length > 1000){
        button_1.classList.remove("comments__add-comment-button_type_enabled");
        button_1.setAttribute("disabled", "");
        button_1.classList.add("comments__add-comment-button_type_disabled");
    }
}

const elem =document. getElementById("addComment");

elem.addEventListener('input', function() {
    autoExpand(elem);})