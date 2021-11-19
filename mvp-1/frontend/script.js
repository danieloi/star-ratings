// Get the modal background
var modalBg = document.getElementById("modal-bg");

// Get the button that opens the modal
var openBtn = document.getElementById("openBtn");

openBtn.onclick = function () {
  modalBg.classList.remove("dn");
  modalBg.classList.add("flex");
  toggleSubmitBtnEnabled();
};

var userRating = 0;

modalBg.onclick = closeModal;

function closeModal() {
  modalBg.classList.add("dn");
  modalBg.classList.remove("flex");
  resetFormRating();
  resetReviewInputField();
  toggleSubmitBtnEnabled();
}

// Get the modal card
var modal = document.getElementById("modal");

modal.onclick = function (e) {
  e.stopPropagation();
};

// Get the parent of the stars in the modal
var formStarParent = document.getElementById("form-star-parent");

var userReview = "";

function setFormRating(clickedRating) {
  userRating = clickedRating;

  for (let index = 0; index < formStarParent.children.length; index++) {
    const child = formStarParent.children[index];
    const star = child.children[0];
    if (index + 1 <= clickedRating) {
      star.classList.add("checked");
    } else {
      star.classList.remove("checked");
    }
  }
  toggleSubmitBtnEnabled();
}

function toggleSubmitBtnEnabled() {
  if (userRating && userReview) {
    enableSubmitBtn();
  } else {
    disableSubmitBtn();
  }
}

const submitBtn = document.getElementById("submitBtn");
function enableSubmitBtn() {
  submitBtn.disabled = false;
  submitBtn.classList.replace("light-gray", "custom-gray-btn");
}

function disableSubmitBtn() {
  submitBtn.disabled = true;
  submitBtn.classList.replace("custom-gray-btn", "light-gray");
}

function resetFormRating() {
  for (let index = 0; index < formStarParent.children.length; index++) {
    const child = formStarParent.children[index];
    const star = child.children[0];
    star.classList.remove("checked");
  }
  userRating = 0;
}

function resetReviewInputField() {
  const review = document.getElementById("review");
  review.value = "";
  userReview = "";
}

const review = document.getElementById("review");

review.oninput = setFormInput;

function setFormInput(e) {
  userReview = e.target.value;
  toggleSubmitBtnEnabled();
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const API_URL = "https://ez7slnv65l.execute-api.us-east-1.amazonaws.com";

async function loadData() {
  const [reviewsResp, averagesResp] = await Promise.all([
    fetch(`${API_URL}/reviews`),
    fetch(`${API_URL}/reviews/average`),
  ]);

  const reviews = await reviewsResp.json();
  const [stats] = await averagesResp.json();

  const average = (stats.sumOfRatings / stats.numOfReviews).toFixed(1);

  // set global rating text
  var rating = document.getElementById("rating");
  rating.innerText = average;

  // set global star rating
  var heroStarRating = document.getElementById("hero-star-rating");
  removeAllChildNodes(heroStarRating);
  generateStarsArray(average).forEach((star) => {
    heroStarRating.appendChild(star);
  });

  var reviewsList = document.getElementById("reviews-list");
  removeAllChildNodes(reviewsList);
  generateReviewsArray(reviews).forEach((review) => {
    reviewsList.appendChild(review);
  });
}

function generateStarsArray(starRating) {
  const starsArr = [];
  const significantStarRating = parseFloat(starRating).toFixed();
  for (let index = 0; index < 5; index++) {
    const starIcon = document.createElement("i");
    if (index + 1 <= significantStarRating) {
      starIcon.classList.add("fas", "fa-lg", "fa-star", "pr1", "checked");
    } else {
      starIcon.classList.add("fas", "fa-lg", "fa-star", "pr1");
    }
    starsArr.push(starIcon);
  }

  return starsArr;
}

function generateReviewsArray(reviews) {
  return reviews.map((review) => {
    const textBoldener = document.createElement("span");
    textBoldener.classList.add("fw7", "black");
    textBoldener.innerText = `${review.rating}.`;

    const text = document.createElement("p");
    text.classList.add("custom-gray", "truncate");
    text.appendChild(textBoldener);
    text.append(` ${review.review}`);

    const starsWrapper = document.createElement("div");
    starsWrapper.classList.add("pr3", "flex-noshrink");
    generateStarsArray(review.rating).forEach((star) => {
      starsWrapper.appendChild(star);
    });

    const wrapper = document.createElement("div");
    wrapper.classList.add("flex", "mb4");
    wrapper.appendChild(starsWrapper);
    wrapper.appendChild(text);

    return wrapper;
  });
}

const LOADING = "loading...";
const SUBMIT_REVIEW = "Submit review";

function toggleSubmitBtnLoading() {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn.innerText === LOADING) {
    enableSubmitBtn();
    submitBtn.innerText = SUBMIT_REVIEW;
    return;
  }
  if (submitBtn.innerText === SUBMIT_REVIEW) {
    disableSubmitBtn();
    submitBtn.innerText = LOADING;
    return;
  }
}

async function postReview() {
  toggleSubmitBtnLoading();
  try {
    await fetch(`${API_URL}/reviews`, {
      method: "POST",
      body: JSON.stringify({
        rating: userRating,
        review: userReview,
      }),
    });

    await loadData();
    toggleSubmitBtnLoading();
    closeModal();
  } catch (error) {
    toggleSubmitBtnLoading();
    console.log(error);
  }
}

function main() {
  loadData();
}

main();
