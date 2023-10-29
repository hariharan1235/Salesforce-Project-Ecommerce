import { LightningElement,wire } from 'lwc';
import Logo from "@salesforce/resourceUrl/Logo";
import { NavigationMixin } from 'lightning/navigation';
import getRelatedList from '@salesforce/apex/Ecommerce.getRelatedList';
// import {MessageContext,subscribe,unsubscribe} from 'lightning/messageService';
// import CartItemtransfer from '@salesforce/messageChannel/CartItemtransfer__c';
export default class Navigation extends NavigationMixin(LightningElement) {
    IsLoading = true;
    ComapanyLogo = Logo;
    Show_product_dropdown_menu = false;
    subscription = null;
    searchRelatedList;
    searchKey = '';
    timer;
    RelatedListDivVisible = false;
    ShowUserDropDownBox = false;
  
    // @wire(MessageContext) MessageContext;



    connectedCallback()
    {
        //   this.handleSubscribe();

        setTimeout(()=>{
            this.IsLoading = false;
        },3000);
    }
    disconnectedCallback()
    {
        // this.handleUnSubscribe();
    }

    // renderedCallback(){
    //     // alert('Renderss..');
    // }

    // handleSubscribe()
    // {
    //     if(!this.subscription)
    //     {
    //         this.subscription = subscribe(this.MessageContext,CartItemtransfer,(data)=>{
    //             console.log(data);
    //         })
    //     }

    // }
    // handleUnSubscribe()
    // {
    //     unsubscribe(this.subscription);
    //     this.subscription = null;
    // }

    handleDropDownMenu()
    {
        if(this.Show_product_dropdown_menu == true)
        {
            this.Show_product_dropdown_menu = false;
        }
        else
        {
            this.Show_product_dropdown_menu = true;
        }
    }


    GoCartPage()
    {
        this.ShowUserDropDownBox = false;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'cart__c'
            }
        });
    }

    GoOrderPage(){
        this.ShowUserDropDownBox = false;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'my_orders__c'
            }
        });

    }

    GoHomePage()
    {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }


    HandleSearchInput(event){



        window.clearTimeout(this.timer)
        const inputValue = event.target.value;
        this.searchKey = inputValue;
        this.timer = setTimeout(() => {
            if(inputValue.length === 0)
            {
                this.searchRelatedList = [];
            }
            else
            {
                this.RelatedListReq(inputValue);
            }
        }, 1000);
    }

    RelatedListReq(seachInput){

        getRelatedList({searchKey:seachInput}).then((data)=>{
            this.searchRelatedList = data;
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        });

    }

    HandleRelatedListClick(event){

        const search_name = event.target.dataset.name;
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'search__c'
            },
            state:{
                'q' : search_name
            }
        });
        
        // alert(this.searchKey);

    }


    GoSearchPage(event){


        if (event.key === 'Enter') {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'search__c'
                },
                state:{
                    'q' : this.searchKey
                }
            });
        }

        

    }



    HandleInputFocus()
    {
        this.RelatedListDivVisible = true;
    }

    HandleInputBlur()
    {
        setTimeout(()=>{
            this.RelatedListDivVisible = false;
        },500)
       
    }

    GoCategoryPage(event){

        this.Show_product_dropdown_menu = false;

        const category = event.target.dataset.category;

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'category__c'
            },
            state:{
                'category' : category
            }
        });

    }

    ToggleUserDropDownMenu(){
        this.ShowUserDropDownBox = !this.ShowUserDropDownBox;
    }


 






    
}