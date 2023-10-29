import { LightningElement,wire } from 'lwc';
import getOrders from '@salesforce/apex/Ecommerce.GetOrder';
import { NavigationMixin } from 'lightning/navigation';
export default class Myorder extends NavigationMixin(LightningElement) {

    order_list;
    Isloading = true;

    @wire (getOrders)
    getCate({data,error}){
        if(data)
        {
            this.order_list = data;
            setTimeout(()=>{
                this.Isloading = false;
            },3000)
        }
        else
        {
            console.log(error);
        }
    }

    GoOrderViewPage(event){
        const orderId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'view_order_detail__c'
            },
            state:{
                'OrderId' : orderId
            }
        });
    }

}