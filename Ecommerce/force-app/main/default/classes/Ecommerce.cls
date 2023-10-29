public class Ecommerce {
    @AuraEnabled(cacheable = true)
    public static List<AggregateResult> getAvailableCategory()
    {
        List<AggregateResult> category = [SELECT Category__c,COUNT(Id) FROM myCustom_product__c GROUP BY Category__c];
        
        return category;
    }
    @AuraEnabled(cacheable = false)
    public static List<Responsewrapper> getProduct(String category)
    {
       
        List<Responsewrapper> Response_product_list = new List<Responsewrapper>();
        
        // ---- Get Products + cart details spefic category only  --  //
        
        List<myCustom_product__c> product_list = [SELECT Id,Name,Product_Thumbnail__c,Price__c,(SELECT Id,Quantity__c FROM myCustom_cartItems__r) FROM myCustom_product__c WHERE Category__c=:category];
        
        for(myCustom_product__c i : product_list)
        {
            Responsewrapper obj = new Responsewrapper();
            obj.ProductId = i.Id;
            obj.ProductName = i.Name;
            obj.ProductPrice = i.Price__c;
            obj.ProductImg = ModifyImgHeightWidth(i.Product_Thumbnail__c);
            if(i.myCustom_cartItems__r.size() == 0){
                obj.IscartAvailable = false;
                obj.CartQuantity = 0;
            }
            else
            {
                 for(myCustom_cartItem__c j :i.myCustom_cartItems__r){
                       obj.IscartAvailable = true;
                       obj.CartQuantity = j.Quantity__c;
                 }  
            }
            Response_product_list.add(obj);
        }
        return Response_product_list;
    }
    @AuraEnabled(cacheable = false)
    public static String getSpecificProduct(String ProductId)
    {
        system.JSONGenerator jp = JSON.createGenerator(true);
        
        jp.writeStartObject();
        
        jp.writeStringField('status','success');
        
        List<myCustom_product__c> productList = [SELECT Id,Name,Price__c,Product_description__c,Product_Image_A__c,Product_Image_B__c,Product_Image_C__c,Product_Image_D__c,	Product_Thumbnail__c FROM myCustom_product__c WHERE Id=:ProductId];
        
        for(myCustom_product__c i : productList)
        {
            jp.writeStringField('ProductName',i.Name);
            jp.writeNumberField('Price',i.Price__c);
            jp.writeStringField('Description',i.Product_description__c);
            jp.writeStringField('ProductLogo',i.Product_Thumbnail__c);
            jp.writeStringField('ProductImgA',i.Product_Image_A__c);
            jp.writeStringField('ProductImgB',i.Product_Image_B__c);
            jp.writeStringField('ProductImgC',i.Product_Image_C__c);
            jp.writeStringField('ProductImgD',i.Product_Image_D__c);
        }
        
        
        // get cart details
       
        Id currentUserId = UserInfo.getUserId();
        
        List<myCustom_cartItem__c> cartItem = [SELECT Id,Quantity__c FROM myCustom_cartItem__c WHERE CreatedById = : currentUserId AND 	myCustom_product__c =:productId];
        
        if(cartItem.size() == 0)
        {
            jp.writeBooleanField('IscartItem',false);
            jp.writeNumberField('Quantity',0);
        }
        else
        {
            for(myCustom_cartItem__c i : cartItem)
            {
                jp.writeBooleanField('IscartItem',true);
                jp.writeNumberField('Quantity',i.Quantity__c);
                
            }
        }
        
        jp.writeEndObject();
        
        string result = jp.getAsString();
        
        return result;
    }
    
    
    @AuraEnabled(cacheable = true)
    public static List<myCustom_order__c> GetOrder(){
        
        List<myCustom_order__c> orders = [SELECT Id,Name,Status__c,TotalAmount__c,OrderDate__c FROM myCustom_order__c ORDER BY OrderDate__c DESC];
        
        return orders;
    }
    @AuraEnabled(cacheable = false)
    public static List<myCustom_product__c> getRelatedList(String searchKey){
        String search_key = '%'+searchKey+'%';
        List<myCustom_product__c> productList = [SELECT Id,Name FROM myCustom_product__c WHERE Name LIKE:search_key LIMIT 8];
        
        return productList;
        
    }
    
    
    @AuraEnabled(cacheable = false)
    public static List<Responsewrapper> GetSearchedProduct(String searchKey)
    {
        
         String search_key = '%'+searchKey+'%';
       
        List<Responsewrapper> Response_product_list = new List<Responsewrapper>();
        
        // ---- Get Products + cart details spefic category only  --  //
        
        List<myCustom_product__c> product_list = [SELECT Id,Name,Product_Thumbnail__c,Price__c,(SELECT Id,Quantity__c FROM myCustom_cartItems__r) FROM myCustom_product__c WHERE Name LIKE:search_key];
        
        for(myCustom_product__c i : product_list)
        {
            Responsewrapper obj = new Responsewrapper();
            obj.ProductId = i.Id;
            obj.ProductName = i.Name;
            obj.ProductPrice = i.Price__c;
            obj.ProductImg = ModifyImgHeightWidth(i.Product_Thumbnail__c);
            if(i.myCustom_cartItems__r.size() == 0){
                obj.IscartAvailable = false;
                obj.CartQuantity = 0;
            }
            else
            {
                 for(myCustom_cartItem__c j :i.myCustom_cartItems__r){
                       obj.IscartAvailable = true;
                       obj.CartQuantity = j.Quantity__c;
                 }  
            }
            Response_product_list.add(obj);
        }
        return Response_product_list;
    }
    
    
    public static String ModifyImgHeightWidth(String Dom_elements){
       // String Dom_elements = '<p><img src="https://cts-33c-dev-ed.develop.file.force.com/servlet/rtaImage?eid=a005h00000vKh3s&amp;feoid=00N5h00000GxGSX&amp;refid=0EM5h000008DiL9" alt="Beach chair.jpg"></img></p>';
        
        
        
        return Dom_elements.replace('img', 'img style="height:180px;width:300px;" ');
    }
    
    @AuraEnabled(cacheable = false)
    public static String getOrderDetails(String orderId){
        
        // Get shipping Address
        
        myCustom_ShippingDetail__c ShipDetails = [SELECT Id,FirstName__c,LastName__c,Address__c,ContactNumber__c,OrderId__r.TotalAmount__c,OrderId__r.Status__c FROM myCustom_ShippingDetail__c WHERE OrderId__c = :orderId];
        
        system.JSONGenerator jp = JSON.createGenerator(true);
        
        jp.writeStartObject();
        
        jp.writeStringField('Name',ShipDetails.FirstName__c+' '+ShipDetails.LastName__c);
        jp.writeStringField('Ship_ID',ShipDetails.Id);
        jp.writeStringField('Ship_Address',ShipDetails.Address__c);
        jp.writeStringField('Ship_Contact',ShipDetails.ContactNumber__c);
        jp.writeStringField('Order_status',ShipDetails.OrderId__r.Status__c);
        jp.writeNumberField('Order_Total',ShipDetails.OrderId__r.TotalAmount__c);
        
        
        // Get OrderItems
        List<myCustom_orderItem__c> orderItems = [SELECT Id,ProductId__r.Name,ProductId__r.Price__c,ProductId__r.Product_Thumbnail__c,Quantity__c,ItemTotal__c FROM myCustom_orderItem__c WHERE OrderId__c = :orderId];
        
        jp.writeFieldName('OrderItems');
        
        jp.writeStartArray();
        
        for(myCustom_orderItem__c i : orderItems)
        {
             jp.writeStartObject();
             jp.writeStringField('ProductName',i.ProductId__r.Name);
             jp.writeNumberField('ProductPrice',i.ProductId__r.Price__c);
             jp.writeStringField('ProductIcon',i.ProductId__r.Product_Thumbnail__c);
             jp.writeNumberField('Quantity',i.Quantity__c);
             jp.writeNumberField('Total',i.ItemTotal__c);
             jp.writeEndObject();
        }
        
        jp.writeEndArray();
        
        jp.writeEndObject();
        
        string result = jp.getAsString();
        
        return result;
    } 
    
    @AuraEnabled(cacheable = false)
    public static string UpdateOrderStatus(String orderId,String status){
        
        myCustom_order__c order = [SELECT Id,Status__c FROM myCustom_order__c WHERE Id=:orderId];
        
        order.Status__c = status;
        
        UPDATE order;
        
        return 'success';
        
    }
    

    
    
    
    public class Responsewrapper
    {
       @auraenabled
       public String ProductId;
       @auraenabled
       public String ProductName;
       @auraenabled
       public Decimal ProductPrice;
       @auraenabled
       public string ProductImg;
       @auraenabled
       public Boolean IscartAvailable;
       @auraenabled
       public Decimal CartQuantity;
       public Responsewrapper(){}
    }
    
    

}