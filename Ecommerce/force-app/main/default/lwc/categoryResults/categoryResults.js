import { LightningElement,wire } from 'lwc';
import getProduct from '@salesforce/apex/Ecommerce.getProduct';
import ManageCartItem from '@salesforce/apex/CartItemManage.ManageCartItem';
import RemoveCartItem from '@salesforce/apex/CartItemManage.RemoveCartItem';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

export default class CategoryResults extends NavigationMixin(LightningElement) {
    category;
    Isloading = true;
    product_list;
    IsProductEmpty = false;
    // @wire(CurrentPageReference) currentPageReference;
    @wire(CurrentPageReference)
    currentPageReferenceHandler(currentPageReference) {
    if (currentPageReference) {
        this.category = currentPageReference.state.category;

        // Handle the state changes, fetch new data, or update your component's state accordingly.
        this.FetchProductList();

    }
}
    connectedCallback(){
        // this.searchKey = this.currentPageReference.state.q;
        // this.FetchProductList();

    }

    FetchProductList(){

        getProduct({category:this.category}).then((data)=>{

            this.product_list = data;

  

            if(this.product_list.length == 0)
            {
                this.IsProductEmpty = true;
            }
            else
            {
                this.IsProductEmpty = false;
            }

            setTimeout(()=>{
                this.Isloading = false;
            },3000);

           

        }).catch((err)=>{

            console.log(err);

        });

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