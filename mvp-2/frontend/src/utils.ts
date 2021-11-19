export function renderHalfOrFullStar(index: number, rating: number) {
  if (Math.ceil(rating) !== rating) {
    // we're dealing with a fraction rating
    /**
     * rating is 3.5 because index 3 was hit once
     * therefore index 3 is supposed to be a half star
     */
    if (Math.floor(rating) === index) {
      return "fa-star-half-alt";
    }
    return "fa-star";
  }

  return "fa-star";
}

export function renderCheckedOrUnCheckedStar(index: number, rating: number) {
  if (index + 1 <= Math.ceil(rating)) {
    return "checked";
  }
  return "";
}
