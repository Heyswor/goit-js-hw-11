import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';

export class PixabyAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };

  async getPhotos() {
    const urlAXIOS = `/?key=30513394-8e383ed067439270a89ebf2b5&q=${
      this.#query
    }&per_page=${this.#perPage}&page=${this.#page}`;
    const { data } = await axios.get(urlAXIOS, this.#params);
    return data;
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

