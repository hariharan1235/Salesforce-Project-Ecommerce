import { LightningElement } from 'lwc';
import getCartItems from '@salesforce/apex/CartItemManage.getCartItems';
import Pay from '@salesforce/apex/Payment.checkout_authorizeDotNet';
import { NavigationMixin } from 'lightning/navigation';
export default class Checkout extends NavigationMixin(LightningElement) {
    cartList;
    product_list = [];
    TotalCost = 0;
    isloading = false;
    mobile_number = '';

    //card_details
    card_num = '';
    card_exp = '';
    card_cvv = '';
    card_name = '';

    //Billing address details

    firstname = '';
    lastname = '';
    billstreet = '';
    billcity = '';
    billstate = '';
    billzip = '';
    billcountry = '';


    payment_success;
    payment_failed_reason;


    connectedCallback()
    {
        this.FetchCartItems();
    }

    FetchCartItems()
    {
        getCartItems().then((data)=>{

            this.cartList = data;
            let find_total_cost = 0;
            for(let i = 0;i<data.length;i++)
            {
                let product_details = {productId:data[i].myCustom_product__c,Quantity:data[i].Quantity__c};

                this.product_list.push(product_details);
              
                find_total_cost = find_total_cost + data[i].Total__c;
            }

            this.TotalCost = find_total_cost;
            
        }).catch((err)=>{
            console.log(err);
        });
    }
    
    // Input Handle for Mobile Number

    HandleMobileNumber(event){
         this.mobile_number = event.target.value;
    }

    // Input Handle for card details

    HandleCardNumber(event){
          this.card_num = event.target.value;
    }
    HandleCardExpDate(event){

        let inputValue = event.target.value;

        if(inputValue.length === 2)
        {
            this.card_exp = inputValue + '/';
        }
        else
        {
            this.card_exp = inputValue;
        }
    }
    HandleCardCVV(event){
        this.card_cvv = event.target.value;
    }
    HandleCardName(event){
        this.card_name = event.target.value;
    }



    // handle inputs for billing address

    HandleCountry(event){
        this.billcountry = event.target.value;
    }
    HandleFirstname(event){
        this.firstname = event.target.value;
    }
    HandleLastName(event){
        this.lastname = event.target.value;
    }
    HandleCity(event){
        this.billcity = event.target.value;
    }
    HandleAddress(event){
        this.billstreet = event.target.value;
    }
    HandlePostalCode(event){
        this.billzip = event.target.value;
    }




    MakePayment(){

        this.isloading = true;


        const Payment_data = {
            ccnum:this.card_num,
            ccexp:this.card_exp,
            ccsec:this.card_cvv,
            firstname:this.firstname,
            lastname:this.lastname,
            billstreet:this.billstreet,
            billcity:this.billcity,
            billstate:this.billstate,
            billzip:this.billzip,
            billcontactNumber:this.mobile_number
        };

        Pay({input:Payment_data,productDetails:this.product_list,TotalAmount:this.TotalCost}).then((data)=>{

            this.isloading = false;

            console.log(data);
            if(data.status === 'success')
            {
                this.payment_success = true;
                let payment_status_box = this.template.querySelector('.payment_status');
                payment_status_box.classList.add('active_payment_status');
            }
            else
            {
                this.payment_success = false;
                this.payment_failed_reason = data.status_details;
                let payment_status_box = this.template.querySelector('.payment_status');
                payment_status_box.classList.add('active_payment_status');
            }
        }).catch((err)=>{
            console.log(err);
        });

    }


    ClodePaymentStatusBox(){
        let payment_status_box = this.template.querySelector('.payment_status');
        payment_status_box.classList.remove('active_payment_status');

        if(this.payment_success)
        {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'my_orders__c'
                }
            });
        }
    }


    GotoOrderPage(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'my_orders__c'
            }
        });
    }
  
}