import { LightningElement,api,wire} from 'lwc';
import Carousel_3 from "@salesforce/resourceUrl/Carousel_3";
import Carousel_1 from "@salesforce/resourceUrl/Carousel_1";
import Carousel_2 from "@salesforce/resourceUrl/Carousel_2";
import getProduct from '@salesforce/apex/Ecommerce.getProduct';
import ManageCartItem from '@salesforce/apex/CartItemManage.ManageCartItem';
import RemoveCartItem from '@salesforce/apex/CartItemManage.RemoveCartItem';
import { NavigationMixin } from 'lightning/navigation';


export default class ProductItems extends NavigationMixin(LightningElement) {

    

    @api category;

    product_list;

    Isloading = false;

    connectedCallback(){

        this.FetchProductList();

        // console.log();

    }

    FetchProductList(){

        getProduct({category:this.category}).then((data)=>{

            this.product_list = data;


            this.Isloading = false;

        }).catch((err)=>{
            console.log(err);
        });

    }



    // @wire (getProduct,{category:'$category'})
    // getProd({data,error}){
    //  if(data)
    //  {
    //         this.product_list = data;
    //  }
    //  else
    //  {
    //         console.log(error);
    //  }
    // }
    tempImg = Carousel_3;
    tempImg2 = Carousel_2;
    tempImg1 = Carousel_1;

    card_margin = 20;
    
    total_margin = this.card_margin*2*4;

    find_width;

    renderedCallback(){

        var card_container = this.template.querySelector(".card_container");
    
        
    
        this.find_width = (card_container.offsetWidth - this.total_margin)/4;
    
        
        this.template.querySelectorAll(".card").forEach((card)=>{
            card.style.width = this.find_width+'px';
        })  
    } 



    Next(){

       
        console.log(this.category_list);

        var scrollElement = this.template.querySelector(".card_container");
    
        scrollElement.scrollLeft += (this.find_width+(this.card_margin*2));        
    
    }
    
    Previous(){
    
        var scrollElement = this.template.querySelector(".card_container");
    
        scrollElement.scrollLeft -= (this.find_width+(this.card_margin*2));
    
    }



    GoProductView(event)
    {
        let productId = event.target.dataset.id;
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'product__c'
            },
            state:{
                'productId' : productId
            }
        });

    }


    DecreseCartQuantity(event){
        const productId = event.target.dataset.id;
        const current_quantity = event.target.dataset.quantity;

        if(current_quantity == 1)
        {
            //Remove cart

            

            this.DeleteCartItem(productId);
        }
        else
        {
            // DecreseCart quantity

            const convertIntType = parseInt(current_quantity, 10);


            this.UpdateCartQuantity(productId,(convertIntType-1)+'');
        }

        console.log(productId);
        console.log(typeof cuurent_quantity);
    }

    IncreseCartQuantity(event){

        const productId = event.target.dataset.id;
        const current_quantity = event.target.dataset.quantity;

        const convertIntType = parseInt(current_quantity, 10);

        this.UpdateCartQuantity(productId,(convertIntType+1)+'');

        console.log(productId);
        console.log(typeof current_quantity);

    }

    AddTocart(event){

        const productId = event.target.dataset.id;

        this.UpdateCartQuantity(productId,'1');
    }

    UpdateCartQuantity(ProductId,Quantity)
    {
        this.Isloading = true;
        ManageCartItem({productId:ProductId,quantity:Quantity}).then((data)=>{

            console.log(data);
            this.FetchProductList();

            

        }).catch((err)=>{
            console.log(err);
            this.Isloading = false;
        });
    }

    DeleteCartItem(ProductId){

        this.Isloading = true;

        RemoveCartItem({productId:ProductId}).then((data)=>{
            console.log(data);

            this.FetchProductList();

           
        }).catch((err)=>{
            console.log(err);
            this.Isloading = false;
            });

    }
}