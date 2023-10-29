import { LightningElement } from 'lwc';
import Logo from "@salesforce/resourceUrl/Logo";
import resource from '@salesforce/resourceUrl/facebook';
import resource1 from '@salesforce/resourceUrl/youtube';
import resource2 from '@salesforce/resourceUrl/X';
import resource3 from '@salesforce/resourceUrl/instagram';
export default class EcommerceFooter extends LightningElement {
        facebook= resource;
        youtube= resource1;
        X=resource2;
        instagram=resource3;
        Company_Logo = Logo;
}