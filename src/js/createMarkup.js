export function createMarkup(photos) {
  return photos
    .map(img => {
      return `<div class="photo-card">
    <a class="photo-link" href="${img.largeImageURL}" onclick="return false;">
    <img src="${img.webformatURL}" data-source="${img.largeImageURL}" alt="${img.tags}" loading="lazy" />
    </a>  
  <div class="info">
    <p class="info-item">
      <b>Likes: <span>${img.likes}</span> </b>
    </p>
    <p class="info-item">
      <b>Views: <span>${img.views}</span> </b>
    </p>
    <p class="info-item">
      <b>Comments: <span>${img.comments}</span> </b>
    </p>
    <p class="info-item">
      <b>Downloads: <span>${img.downloads}</span> </b>
    </p>
  </div>
</div>`;
    })
    .join('');
}
