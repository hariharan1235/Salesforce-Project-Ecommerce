import { LightningElement } from 'lwc';

export default class ComponentB extends LightningElement {

    renderedCallback()
    {

        let boxes = this.template.querySelectorAll('.box');
        boxes.forEach((box,i)=>{
            box.addEventListener('click',this.handleClick);
        });
    }
    handleClick()
    {
        alert('clicked!!');
    }
   
}