import { LightningElement,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getSpecificProduct from '@salesforce/apex/Ecommerce.getSpecificProduct';
import ManageCartItem from '@salesforce/apex/CartItemManage.ManageCartItem';
import RemoveCartItem from '@salesforce/apex/CartItemManage.RemoveCartItem';
import { NavigationMixin } from 'lightning/navigation';
// import {MessageContext,publish} from 'lightning/messageService';
// import CartItemtransfer from '@salesforce/messageChannel/CartItemtransfer__c';

export default class ProductView extends NavigationMixin(LightningElement) {

    

    cart_quantity = 0;
    productId;
    product_name;
    product_price;
    product_logo;
    product_imageA;
    product_imageB;
    product_imageC;
    product_imageD;
    product_description;
    product_imageA_with_large_with;
    product_imageB_with_large_with;
    product_imageC_with_large_with;
    product_imageD_with_large_with;
    product_selected_image_index = 0;
    product_current_view_image;
    cartBtnName = 'Add to cart';

    @wire(CurrentPageReference) currentPageReference;

    connectedCallback()
    {
        this.productId = this.currentPageReference.state.productId;

        this.getProductRecord();
    }
    renderedCallback()
    {
        var product_img = this.template.querySelectorAll('.img_container');

        product_img.forEach((img,i)=>{
            img.addEventListener('click',this.handleClick.bind(this));
            img.index = i;
        });
    }

    handleClick(event)
    {
        let index = event.currentTarget.index;

        let selected_img = this.template.querySelector('.selected_img');
        selected_img.classList.remove('selected_img');
        event.currentTarget.classList.add('selected_img');

        if(index === 0){
            this.product_current_view_image = this.product_imageA_with_large_with;
        }
        else if(index === 1){
            this.product_current_view_image = this.product_imageB_with_large_with;
        }
        else if(index === 2){
            this.product_current_view_image = this.product_imageC_with_large_with;
        }
        else{
            this.product_current_view_image = this.product_imageD_with_large_with;
        }
    }


    getProductRecord()
    {
        getSpecificProduct({ProductId:this.productId}).then((data)=>{
            
            const responseData = JSON.parse(data);

            console.log(responseData);
            //style="height: 100px;"
            this.product_name = responseData.ProductName;
            this.product_price = responseData.Price;
            this.product_imageA = responseData.ProductImgA.replace("img", "img style='height: 100px;'");
            this.product_imageB = responseData.ProductImgB.replace("img", "img style='height: 100px;'");
            this.product_imageC = responseData.ProductImgC.replace("img", "img style='height: 100px;'");
            this.product_imageD = responseData.ProductImgD.replace("img", "img style='height: 100px;'");
            this.product_logo = responseData.ProductLogo;
            this.product_description = responseData.Description;

            this.product_imageA_with_large_with = responseData.ProductImgA.replace("img", "img style='height: 400px;width:100%'");
            this.product_imageB_with_large_with = responseData.ProductImgB.replace("img", "img style='height: 400px;width:100%'");
            this.product_imageC_with_large_with = responseData.ProductImgC.replace("img", "img style='height: 400px;width:100%'");
            this.product_imageD_with_large_with = responseData.ProductImgD.replace("img", "img style='height: 400px;width:100%'");

            this.product_current_view_image = responseData.ProductImgA.replace("img", "img style='height: 400px;width:100%'");


            //cart 

            this.cart_quantity = responseData.Quantity;
            if(responseData.IscartItem)
            {
                this.cartBtnName = 'Cart Added';
            }

        }).catch(err => {
            console.log(err);
        })
    }



    




    // cart Management...


    AddCartItem()
    {
        this.cartBtnName = 'Cart Added';
        this.cart_quantity = 1;
        this.passCartItemToServer();
    }

    LessCartItem()
    {
        if(this.cart_quantity !== 1)
        {
            this.cart_quantity = this.cart_quantity - 1;
            this.passCartItemToServer();
            // Pass cart item to nav div
        }
        if(this.cart_quantity ==1 && this.cartBtnName == 'Cart Added')
        {
             this.removeCartItem();
             this.cart_quantity = 0;
             this.cartBtnName = 'Add to cart';
        }
    }

    IncreseCartItem()
    {
        if(this.cart_quantity == 0)
        {
            this.cartBtnName = 'Cart Added';
        }
        this.cart_quantity = this.cart_quantity + 1;
        this.passCartItemToServer();

    }

    passCartItemToServer()
    {
        ManageCartItem({productId:this.productId,quantity:this.cart_quantity}).then((data)=>{

            console.log(data);


        }).catch((err)=>{
            console.log(err);
        });
    }

    removeCartItem()
    {
        RemoveCartItem({productId:this.productId}).then((res)=>{
            console.log(res);
        }).catch(err=>{
            console.log(err);
        });
    }


    GoCheckOutPage(){

        if(this.cart_quantity === 0)
        {
            this.cart_quantity = 1;
        }

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'checkout_single_product__c'
            },
            state:{
                'productId' : this.productId,
                'productName':this.product_name,
                'prodcutPrice':this.product_price,
                'productLogo':this.product_logo,
                'Quantity':this.cart_quantity
            }
        });


    }



    // passCartItemToNavigation()
    // {
    //     let payload = {productId:this.productId,Quantity:this.cart_quantity}
    //     publish(this.MessageContext,CartItemtransfer,payload);
    // }

  
}