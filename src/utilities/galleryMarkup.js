import { refs } from "./refs";

export function galleryMarkup(images) {

    const imageMarkup = images.map(image => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

        return `
<div class="photo-card">
 <a class="largeImage" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="600" height="400"/>
    </a>
    <div class="info">
        <p class="info-item">
            <b>Likes</b>
           <span>${likes}</span>     
        </p>
        <p class="info-item">
            <b>Views</b>
             <span>${views}</span> 
        </p>
        <p class="info-item">
            <b>Comments</b>
             <span>${comments}</span> 
        </p>
        <p class="info-item">
            <b>Downloads</b>
             <span>${downloads}</span> 
        </p>
    </div>
</div>
        `
    }).join(``);

    return refs.gallery.insertAdjacentHTML("beforeend", imageMarkup);
}
