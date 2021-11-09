// Get the modal background
var modalBg = document.getElementById("modal-bg");

// Get the modal card
var modal = document.getElementById("modal");

// Get the button that opens the modal
var openBtn = document.getElementById("openBtn");

openBtn.onclick = function () {
  modalBg.classList.remove("dn");
};

modalBg.onclick = function (e) {
  modalBg.classList.add("dn");
};

modal.onclick = function (e) {
  e.stopPropagation();
};

// Get the parent of the stars in the modal
var formStarParent = document.getElementById("form-star-parent");

var userRating = 0;
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
  console.log({ userRating });
}

function setFormReview() {
  userReview = document.getElementById("review").ariaValueMax;
}

async function loadData() {
  const [reviewsResp, averagesResp] = await Promise.all([
    fetch("https://ez7slnv65l.execute-api.us-east-1.amazonaws.com/reviews"),
    fetch(
      "https://ez7slnv65l.execute-api.us-east-1.amazonaws.com/reviews/average"
    ),
  ]);

  const reviews = await reviewsResp.json();
  const [stats] = await averagesResp.json();

  const average = (stats.sumOfRatings / stats.numOfReviews).toFixed(1);
  console.log({ stats });

  // set global rating text
  var rating = document.getElementById("rating");
  rating.innerText = average;

  // set global star rating
  var heroStarRating = document.getElementById("hero-star-rating");
  generateStarsArray(average).forEach((star) => {
    heroStarRating.appendChild(star);
  });
}

function generateStarsArray(starRating) {
  const starsArr = [];
  const significantStarRating = starRating.toFixed();
  for (let index = 0; index < 5; index++) {
    const starIcon = document.createElement("i", {});
    if (index + 1 <= significantStarRating) {
      starIcon.classList.add("fas", "fa-ls", "fa-star", "checked");
    } else {
      starIcon.classList.add("fas", "fa-ls", "fa-star");
    }
    starsArr, push(starIcon);
  }

  return starsArr;
}

loadData();

async function postReview() {
  try {
    await fetch(
      "https://ez7slnv65l.execute-api.us-east-1.amazonaws.com/reviews",
      {
        method: "POST",
        body: {
          rating: userRating,
          review: userReview,
        },
      }
    );

    userReview = "";
    userRating = 0;
    modalBg.classList.add("dn");
  } catch (error) {
    console.log(error);
  }
}
