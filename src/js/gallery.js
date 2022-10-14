
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from "../utilities/refs";
import { galleryMarkup } from "../utilities/galleryMarkup";
import { RequestApi } from "../utilities/requestAPI";
import { spinnerStart, spinnerStop } from '../utilities/spinner';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const requestApi = new RequestApi;

const lightbox = new SimpleLightbox('.largeImage');

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
 
        if (requestApi.isShowLoadMore) { 
            refs.buttonLoad.classList.remove(`is-hidden`) 
 
        } else if (data.hits.length === 0) {
            return Notify.warning(`Sorry, there are no images matching your search query. Please try again.`);
        }   

        Notify.info(`Total number of photographs found: ${data.totalHits}`);

        galleryMarkup(data.hits);

        lightbox.refresh();
        
    } catch (error) {
        console.log(error);
            clearPage();
            Notify.failure(`Sorry, something went wrong`);
    } finally {
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

