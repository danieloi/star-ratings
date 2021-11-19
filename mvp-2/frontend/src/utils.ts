export function renderHalfOrFullStar(index: number, rating: number) {
  if (Math.ceil(rating) !== rating) {
    // we're dealing with a fraction rating
    if (Math.floor(rating) === index) {
      return "fa-star-half-alt";
    }
  }

  return "fa-star";
}

export function renderCheckedOrUnCheckedStar(index: number, rating: number) {
  if (index + 1 <= Math.ceil(rating)) {
    return "checked";
  }
  return "";
}
