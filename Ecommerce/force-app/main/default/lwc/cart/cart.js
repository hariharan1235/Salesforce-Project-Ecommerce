import { LightningElement } from 'lwc';
import getCartItems from '@salesforce/apex/CartItemManage.getCartItems';
import RemoveCartItem from '@salesforce/apex/CartItemManage.RemoveCartItemWithId';
import ManageCartItem from '@salesforce/apex/CartItemManage.ManageCartItem';
import { NavigationMixin } from 'lightning/navigation';

export default class Cart extends NavigationMixin(LightningElement) {

    cartList;
    isloading = false;
    iscartEmpty = false;

    TotalCost = 0;


    connectedCallback()
    {
        this.isloading = true;
        this.fetchCartData();
    }

    fetchCartData()
    {
        getCartItems().then((data)=>{
            if(data.length === 0)
            {
                this.iscartEmpty = true;
            }

            this.cartList = data;
            let find_total_cost = 0;
            for(let i = 0;i<data.length;i++)
            {
                find_total_cost = find_total_cost + data[i].Total__c;
            }
            this.TotalCost = find_total_cost;
            this.isloading = false;
            
        }).catch((err)=>{
            console.log(err);
        });
    }

    RemoveCart(event)
    {
           this.isloading = true;

           let cartId = event.target.dataset.id;

           RemoveCartItem({CartId:cartId}).then((res)=>{
              if(res === 'success')
              {
                  this.fetchCartData();
              }
              console.log(res);
           }).catch((err)=>{
                console.log(err);
           });
    }

    IncreseCartQuantity(event)
    {
          let productId = event.target.dataset.id;
          let quantity = parseInt(event.target.dataset.quantity);

        //   console.log(productId+ "" + quantity);

         this.updateQuantity(productId,quantity+1);
    }


    DecreseCartQuantity(event)
    {
        let productId = event.target.dataset.id;
        let quantity = parseInt(event.target.dataset.quantity);

        // console.log(productId+ "" + quantity);

        this.updateQuantity(productId,quantity-1);
    }

    updateQuantity(productId,quantity)
    {
        this.isloading = true;
        ManageCartItem({productId:productId,quantity:quantity}).then((data)=>{

            if(data === 'success')
            {
                this.fetchCartData();
            }

        }).catch((err)=>{
            console.log(err);
        });

    }



    GoHomepage()
    {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }

    ProceedCheckOut(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'checkout__c'
            }
        });
    }
}