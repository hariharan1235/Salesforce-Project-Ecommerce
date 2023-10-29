import { LightningElement } from 'lwc';
export default class ComponentA extends LightningElement {


    payment_success = true;
    handleClick(){

       let payment_status_box = this.template.querySelector('.payment_status');

       payment_status_box.classList.add('active_payment_status');
    }

    ToggleError()
    {
          this.payment_success = false;
    }



  
  
}