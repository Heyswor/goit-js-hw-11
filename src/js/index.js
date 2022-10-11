import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabyAPI, PixabyAPI } from './pixabyAPI';
import { createMarkup } from './createMarkup';
import { refs } from './refs';

const pixaby = new PixabyAPI();

const handleSubmit = event => {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    Notify.failure('Введить дані для пошуку!');
    return;
  }
  pixaby.query = query;
  clearPage();

  pixaby
    .getPhotos()
    .then(({ hits, total }) => {
      if (hits.length === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      const markup = createMarkup(hits);
      refs.galery.insertAdjacentHTML('beforeend', markup);
      const lightbox = new SimpleLightbox('.gallery a', {});
      pixaby.calcTotalPages(total);
      Notify.success(`Hooray! We found ${total} images.`);
      if (pixaby.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('visually-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message, 'Виникла проблема');
      clearPage();
    });
};

const onLoadMore = () => {
  pixaby.incrementPage();

  if (!pixaby.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  pixaby.getPhotos().then(({ hits }) => {
    const markup = createMarkup(hits);
    refs.galery.insertAdjacentHTML('beforeend', markup);
    const lightbox = new SimpleLightbox('.gallery a', {}).catch(error => {
      Notify.failure(error.message, 'Some Error coming');
      clearPage();
    });
  });
};

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixaby.resetPage();
  refs.galery.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
