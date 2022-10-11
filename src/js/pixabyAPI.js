export class PixabyAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;

  getPhotos() {
    const url = `https://pixabay.com/api/?key=30513394-8e383ed067439270a89ebf2b5&q=${
      this.#query
    }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
      this.#perPage
    }&page=${this.#page}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calcTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
