import { LightningElement } from 'lwc';
import Carousel_1 from "@salesforce/resourceUrl/Carousel_1";
import Carousel_2 from "@salesforce/resourceUrl/Carousel_2";
import Carousel_3 from "@salesforce/resourceUrl/Carousel_3";

export default class Carousel extends LightningElement {




    Carousel_1_img = Carousel_1;
    Carousel_2_img = Carousel_2;
    Carousel_3_img = Carousel_3;

    currect_active_carousel_index = 0;




    GoNextSlide = () => {
        let carousel_items = this.template.querySelectorAll(".carousel__item");
        let carousel__dots = this.template.querySelectorAll(".carousel__dot");
        let NextSlideIndex;
        if(this.currect_active_carousel_index === 2)
        {
            NextSlideIndex = 0;
        }
        else
        {
            NextSlideIndex = this.currect_active_carousel_index + 1;
           
        }

        carousel_items[this.currect_active_carousel_index].classList.remove("carousel__item--selected");
        carousel_items[NextSlideIndex].classList.add("carousel__item--selected");

        carousel__dots[this.currect_active_carousel_index].classList.remove("carousel__dot--selected");
        carousel__dots[NextSlideIndex].classList.add("carousel__dot--selected");

        this.currect_active_carousel_index = NextSlideIndex;
    }

    GoPrevSlide = () => 
    {

        let carousel_items = this.template.querySelectorAll(".carousel__item");
        let carousel__dots = this.template.querySelectorAll(".carousel__dot");
        let NextSlideIndex;
        if(this.currect_active_carousel_index === 0)
        {
            NextSlideIndex = 2;
        }
        else
        {
            NextSlideIndex = this.currect_active_carousel_index - 1;
        }

        carousel_items[this.currect_active_carousel_index].classList.remove("carousel__item--selected");
        carousel_items[NextSlideIndex].classList.add("carousel__item--selected");

        carousel__dots[this.currect_active_carousel_index].classList.remove("carousel__dot--selected");
        carousel__dots[NextSlideIndex].classList.add("carousel__dot--selected");

        this.currect_active_carousel_index = NextSlideIndex;

    }


}