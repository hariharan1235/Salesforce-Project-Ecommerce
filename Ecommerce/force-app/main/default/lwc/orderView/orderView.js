import { LightningElement,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import GetOrderDetails from '@salesforce/apex/Ecommerce.getOrderDetails';
import UpdateOrderStatus from '@salesforce/apex/Ecommerce.UpdateOrderStatus';
export default class OrderView extends LightningElement {

    //view_order_detail
    OrderId;
    Order_details;
    Isloading = true;

    @wire(CurrentPageReference) currentPageReference;
    
    connectedCallback(){
        this.OrderId = this.currentPageReference.state.OrderId;
        this.FetchOrderDetails();
    }


    FetchOrderDetails(){
        GetOrderDetails({orderId:this.OrderId}).then((data)=>{

            const responseData = JSON.parse(data);

            setTimeout(()=>{
                this.Isloading = false; 
            },3000);

            this.Order_details = responseData;

            if(this.Order_details.Order_status === 'Cancelled')
            {

                this.DisableCancelBTn();
            }

           

        }).catch((err)=>{
             console.log(err);
        });
    }


    CancelOrder(){
        if(this.Order_details.Order_status !== 'Cancelled')
        {
            var result = confirm("Are you sure cancel this order");
            if (result == true) {
                UpdateOrderStatus({orderId:this.OrderId,status:'Cancelled'}).then((data)=>{
                   if(data === 'success'){
                      alert('Order Cancelled..');
                      this.FetchOrderDetails();
                   }
                }).catch((err)=>{
                    console.log(err);
                });
            } 
        }
      
    }




   
}