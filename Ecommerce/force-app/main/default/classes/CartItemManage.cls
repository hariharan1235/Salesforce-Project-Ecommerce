public class CartItemManage {
    
    @AuraEnabled(cacheable = false)
    public static String ManageCartItem(String productId,String quantity)
    {
        Id currentUserId = UserInfo.getUserId();
        
        List<myCustom_cartItem__c> cartItem = [SELECT Id,Quantity__c FROM myCustom_cartItem__c WHERE CreatedById = : currentUserId AND 	myCustom_product__c =:productId];
        
        if(cartItem.size() == 0)
        {
            // INSERT the new cart record
            
            myCustom_cartItem__c NewCartItem = new myCustom_cartItem__c();
            NewCartItem.myCustom_product__c = productId;
            NewCartItem.Quantity__c = Integer.ValueOf(quantity);
            
            INSERT NewCartItem; 
            
            return 'success';
        }
        else
        {
            // UPDATE cart quantity
            
            for(myCustom_cartItem__c i : cartItem)
            {
                i.Quantity__c = Integer.ValueOf(quantity);
            }
            
            UPDATE cartItem;
            
            return 'success';
        }   
    }
    
    @AuraEnabled(cacheable = false)
    public static String RemoveCartItem(String productId)
    {
        Id currentUserId = UserInfo.getUserId();
        
        myCustom_cartItem__c cartItem = [SELECT Id FROM myCustom_cartItem__c WHERE CreatedById = : currentUserId AND 	myCustom_product__c =:productId];
        
        DELETE cartItem;
        
        return 'success';
    }
    
    @AuraEnabled(cacheable = false)
    public static List<myCustom_cartItem__c> getCartItems()
    {
        
        List<myCustom_cartItem__c> mylist = [SELECT Id,Quantity__c,Total__c,myCustom_product__c,myCustom_product__r.Name,myCustom_product__r.Price__c,myCustom_product__r.Product_Thumbnail__c FROM myCustom_cartItem__c];
        
        return mylist;
        
    }
    
    @AuraEnabled(cacheable = false)
    public static String RemoveCartItemWithId(String CartId)
    {
        myCustom_cartItem__c cart = [SELECT Id FROM myCustom_cartItem__c WHERE Id =: CartId];
        
        DELETE cart;
        
        return 'success';
    }

}