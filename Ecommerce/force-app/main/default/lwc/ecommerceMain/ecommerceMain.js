import { LightningElement,wire } from 'lwc';
import CategoryIcon from "@salesforce/resourceUrl/CategoryIcon";
import getCategoryList from '@salesforce/apex/Ecommerce.getAvailableCategory';
import { NavigationMixin } from 'lightning/navigation';

export default class EcommerceMain extends NavigationMixin(LightningElement) {
    TableLogo = CategoryIcon+'/table (1).png';
    ChairLogo = CategoryIcon+'/chair.png';
    SofaLogo = CategoryIcon+'/convenient.png';
    BedLogo = CategoryIcon+'/double-bed.png';
    TV_unitLogo = CategoryIcon+'/tv.png';
    Book_shelvesLogo = CategoryIcon+'/bookshelf.png';
    ShoerackLogo = CategoryIcon+'/shoe-rack.png';
    CabinetLogo = CategoryIcon+'/cabinet.png';
    DresserLogo = CategoryIcon+'/wardrobe.png';
    BenchLogo = CategoryIcon+'/bench.png';





    category_list;

    @wire (getCategoryList)
    getCate({data,error}){
        if(data)
        {
            this.category_list = data;
        }
        else
        {
            console.log(error);
        }
    }

    GoCategoryPage(event){

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
}