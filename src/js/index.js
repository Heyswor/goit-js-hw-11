import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabyAPI } from './pixabyAPI';
import { createMarkup } from './createMarkup';
import { refs } from './refs';

const pixaby = new PixabyAPI();

const handleSubmit = async event => {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.target;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    clearPage();
    Notify.failure('Nothing to show!');
    return;
  }
  pixaby.query = query;
  clearPage();
  try {
    const { hits, total } = await pixaby.getPhotos();
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createMarkup(hits);
    refs.galery.insertAdjacentHTML('beforeend', markup);
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    pixaby.calcTotalPages(total);

    Notify.success(`Hooray! We found ${total} images.`);

    if (pixaby.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('visually-hidden');
    }
  } catch (error) {
    Notify.failure(error.message, 'Виникла проблема');
    clearPage();
  }
};

const onLoadMore = async () => {
  pixaby.incrementPage();

  if (!pixaby.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  try {
    const { hits } = await pixaby.getPhotos();
    const markup = createMarkup(hits);
    refs.galery.insertAdjacentHTML('beforeend', markup);
    const { height: cardHeight } = document
      .querySelector('.photo-card')
      .getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.66,
      behavior: 'smooth',
    });
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Some Error coming');
    clearPage();
  }
};

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixaby.resetPage();
  refs.galery.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
}
