/** Stable feed filter URL — uses category id so renames do not break shared links. */
export function buildCategoryFeedHref(feedHref: string, categoryId: string) {
    return `${feedHref}?category=${encodeURIComponent(categoryId)}`;
}
