
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from "../utilities/refs";
import { galleryMarkup } from "../utilities/galleryMarkup";
import { RequestApi } from "../utilities/requestAPI";
import { spinnerStart, spinnerStop } from '../utilities/spinner';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const requestApi = new RequestApi;
const lightbox = new SimpleLightbox('.largeImage');

// бесконечный скролл

// const options = {
//     root: document.querySelector('#scrollArea'),
//     rootMargin: '100px',
//     threshold: 1.0
// }
// const callback = async function(entries, observer) {
//     entries.forEach(async entry => {
         
//         if (entry.isIntersecting && entry.intersectionRect.bottom > 1100) {
//             console.log(entry.intersectionRect);

//             requestApi.incrementPage();
//             observer.unobserve(entry.target);
            
//              try {
//         const data = await requestApi.getPhoto();

//         galleryMarkup(data.hits);

//         lightbox.refresh();
                 
//         if (requestApi.isShowLoadMore) {
        
//          const target = document.querySelector(`.photo-card:last-child`);
        
//         io.observe(target);
//         }  

//          } catch (error) {
//          console.log(error);
//             clearPage();
//         Notify.failure(`Sorry, something went wrong`);
        
//         }
//        }   
//     });
// };

// const io = new IntersectionObserver(callback, options);


refs.form.addEventListener(`submit`, onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    
    clearPage();
    
    spinnerStart();

    const {elements: {searchQuery}} = e.currentTarget;
    const searchQueryFilter = searchQuery.value.trim().toLowerCase();
    
    requestApi.searchQuery = searchQueryFilter;

    try {
         const data = await requestApi.getPhoto();
        
        requestApi.calculateTotalPages(data.totalHits);
 
          if (data.hits.length === 0) {
            return Notify.warning(`Sorry, there are no images matching your search query. Please try again.`);
        }   

        Notify.info(`Total number of photographs found: ${data.totalHits}`);

        galleryMarkup(data.hits);
       
        smoothScroll();
        
        lightbox.refresh();

        if (requestApi.isShowLoadMore) { 
            refs.buttonLoad.classList.remove(`is-hidden`) 

        //     const target = document.querySelector(`.photo-card:last-child`);
        
        // io.observe(target);
        }
        
    } catch (error) {
        console.log(error);
            clearPage();
            Notify.failure(`Sorry, something went wrong`);
    }

    finally {
        spinnerStop();
    }       
}




refs.buttonLoad.addEventListener(`click`, onButtonLoad);

async function onButtonLoad(e) {
    requestApi.incrementPage();

    spinnerStart();
     
    if (!requestApi.isShowLoadMore) {
        refs.buttonLoad.classList.add(`is-hidden`);
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
    
    try {
        const data = await requestApi.getPhoto();

        galleryMarkup(data.hits);

        smoothScroll();

        lightbox.refresh();

    } catch (error) {
         console.log(error);
            clearPage();
        Notify.failure(`Sorry, something went wrong`);
        
    } finally {
        spinnerStop();
    }
}

function clearPage() {
    requestApi.resetPage();
    refs.gallery.innerHTML = ``;
    refs.buttonLoad.classList.add(`is-hidden`)
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
