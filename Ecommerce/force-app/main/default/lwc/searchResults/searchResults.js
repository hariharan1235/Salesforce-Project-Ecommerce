import { LightningElement,wire } from 'lwc';
import getProduct from '@salesforce/apex/Ecommerce.GetSearchedProduct';
import ManageCartItem from '@salesforce/apex/CartItemManage.ManageCartItem';
import RemoveCartItem from '@salesforce/apex/CartItemManage.RemoveCartItem';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

export default class SearchResults extends NavigationMixin(LightningElement) {
    searchKey;
    Isloading = true;
    product_list;
    // @wire(CurrentPageReference) currentPageReference;
    @wire(CurrentPageReference)
    currentPageReferenceHandler(currentPageReference) {
    if (currentPageReference) {
        this.searchKey = currentPageReference.state.q;
        // Handle the state changes, fetch new data, or update your component's state accordingly.
        this.FetchProductList();
    }
}
    connectedCallback(){
        // this.searchKey = this.currentPageReference.state.q;
        // this.FetchProductList();

    }

    FetchProductList(){

        getProduct({searchKey:this.searchKey}).then((data)=>{

            this.product_list = data;

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