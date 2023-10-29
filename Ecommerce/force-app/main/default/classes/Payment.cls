public class Payment {
    
    
    public static string APILOGIN = '85gf5FZf';  
    public static string APITRANSKEY = '9Qg474s8M8zVUgfE';
    @AuraEnabled(cacheable = false)
    public static client_response_wrapper checkout_authorizeDotNet(RequestWrapper input,List<ProductDetailWrapper> productDetails,Integer TotalAmount)
    {
        
         System.debug(input);
         System.debug(TotalAmount);
         System.debug(productDetails);
         HttpRequest req = new HttpRequest();
        
         req.setEndpoint('https://test.authorize.net/gateway/transact.dll'); 
         req.setMethod('POST');
        
         Map<string,string> messagestring = new map<String,String>();
        
        
         messagestring.put('x_login',APILOGIN);
    	 messagestring.put('x_tran_key',APITRANSKEY);  
    	 messagestring.put('x_version', '3.1');
    	 messagestring.put('x_delim_data', 'TRUE');
    	 //specify delimiter character for response
    	 messagestring.put('x_delim_char', ';');
    	 messagestring.put('x_relay_response', 'FALSE');  
    	 //The type of transaction
    	 messagestring.put('x_type', 'AUTH_CAPTURE');
    	 //Processing credit card
    	 messagestring.put('x_method', 'CC');
      
    	 //Transaction Specific Information
    	 //card numbers, expiration, security codes
    	 messagestring.put('x_card_num', input.ccnum);
    	 messagestring.put('x_exp_date', input.ccexp);
    	 messagestring.put('x_card_code', input.ccsec);
    
    	 //transaction amount
    	 messagestring.put('x_amount',''+TotalAmount);
    	 //description of transaction
    	 messagestring.put('x_description', 'Your Transaction: '+input.ordername);
    
    	 //billing information
    	 messagestring.put('x_first_name', input.firstname);
    	 messagestring.put('x_last_name', input.lastname);
    	 messagestring.put('x_address', input.billstreet);
    	 messagestring.put('x_city', input.billcity);
    	 messagestring.put('x_state', input.billstate);
    	 messagestring.put('x_zip', input.billzip);
        
        
         //encode the message components
    	 String encodedmsg = '';
    	 for (string s : messagestring.keySet()){
      			string v = messagestring.get(s);
      		 	//fix null values
      			if (string.isblank(v)) v='';
          		encodedmsg += s+'='+EncodingUtil.urlEncode(v, 'UTF-8')+'&';
    	  }  
    	  //add message termination
    	 
    	  encodedmsg += 'endofdata';
        
          req.setBody(encodedmsg);
        
          //send and collect response
          
    	  Http http = new Http();
        
     	  string resp = http.send(req).getbody();
        
          system.debug(resp);
        
          // Split Response and convert ResponseWrapper type
        
          list<string> split_responses = resp.split(';');
        
        
          ResponseWrapper response_data = parseIntoResponseWrapper(split_responses);
        
          // Insert Transaction Details..
          
          InsertTransactionDetails(response_data);
        
          // If payment success...
          
          if(response_data.responseCode == '1')
          {
               	// After payment success... 
        
        
          		// 1st step ---> Create Order and get Order Id
        
          		String orderId = CreateOrder(TotalAmount,''+response_data.TransactionID);
        
        
        
          		// 2 nd step ---> Store All order Items
        
          		AddOrderItems(orderId,productDetails);
        
        
        
          		// 3rd step --> Store shipping Address
        
          		AddShippingAddress(orderId,input.firstname,input.lastname,input.billcontactNumber,input.billstreet,input.billcountry,input.billstate,input.billcity,input.billzip);
        
          		// Final Step ---> Send Response to customer or client side
          		// 
          		client_response_wrapper cli_res = new client_response_wrapper();
              
                cli_res.status = 'success';
                cli_res.transaction_id = response_data.TransactionID;
                cli_res.status_details = response_data.ResponseReasonText;
              
              return cli_res;
          }
        
          else
          {
              client_response_wrapper cli_res = new client_response_wrapper();
              
              cli_res.status = 'failed';
              cli_res.transaction_id = '';
              cli_res.status_details = response_data.ResponseReasonText;
              
              return cli_res;
          }
        
         
        
        
          
        
         
    }
    
    // Method for Store Transaction details....
    public static void InsertTransactionDetails(ResponseWrapper res)
    {
 
        myCustom_payment__c tr = new myCustom_payment__c();
        
        tr.responseCode__c = res.responseCode;
        tr.ResponseReasonCode__c = res.ResponseReasonCode;
        tr.ResponseReasonText__c = res.ResponseReasonText;
        tr.TransactionID__c = res.TransactionID;
        tr.InvoiceNumber__c = res.InvoiceNumber;
        tr.Amount__c = res.Amount;
        tr.Method__c = res.Method;
        tr.TransactionType__c = res.TransactionType;
        
        INSERT tr;
    }
    
    // Method for place order
    public static String CreateOrder(Integer Amount,String TransactionId)
    {
        myCustom_order__c order = new myCustom_order__c();
        
        order.Status__c = 'Order Confirmed';
        
        order.TotalAmount__c = Amount;
        
        order.TransactionID__c = TransactionId;
        
        INSERT order;
        
        return order.ID;
        
    }
    
    // Method for add OrderItems after Order create
    public static void AddOrderItems(String Id,List<ProductDetailWrapper> productList)
    {
        List<myCustom_orderItem__c> orderItems = new List<myCustom_orderItem__c>();
        
        for(ProductDetailWrapper i : productList)
        {
            myCustom_orderItem__c item = new myCustom_orderItem__c();
            
            item.OrderId__c = Id;
            item.ProductId__c = i.productId;
            item.Quantity__c = i.Quantity;
            
            orderItems.add(item);
        }
        
        INSERT orderItems;
    }
    
    // Method for add Shipping Address
    
    public static void AddShippingAddress(String orderId,String firstName,String lastName,String ContactNumber,String Address,String country,string state,String city,string zipCode)
    {
        myCustom_ShippingDetail__c ship = new myCustom_ShippingDetail__c();
        
        ship.OrderId__c =  orderId;
        ship.FirstName__c = firstName;
        ship.LastName__c = lastName;
        ship.ContactNumber__c = ContactNumber;
        ship.Country__c = country;
        ship.State__c = state;
        ship.Address__c = Address;
        ship.zipCode__c = zipCode;
        
        INSERT ship;
        
    }
    
    
    
    public static void test()
    {
        RequestWrapper obj = new RequestWrapper();
        obj.ccnum = '5105105105105100';
        obj.ccexp = '12/26';
        obj.ccsec = '178';
        obj.amt = '250';
        obj.firstname = 'Test';
        obj.lastname = 'Test';
        obj.billstreet = 'Test';
        obj.billcity = 'Test';
        obj.billstate = 'Test';
        obj.billcountry = 'Test';
        obj.billzip = 'Test';
        obj.billcontactNumber = '1234567890';
        
        
        List<ProductDetailWrapper> myList = new List<ProductDetailWrapper>();
        
        
        ProductDetailWrapper product1 = new ProductDetailWrapper();
        product1.productId = 'a005h00000vKh5oAAC'; //Price 195
        product1.Quantity = 2;
        
        
        
        ProductDetailWrapper product2 = new ProductDetailWrapper();
        product2.productId = 'a005h00000vKh5aAAC'; //Price 480
        product2.Quantity = 2;
        
        
        myList.add(product1);
        myList.add(product2);
        
        //Total = 1350;
        
        checkout_authorizeDotNet(obj,myList,1350);
          
        
    }
    
    
    
    public static ResponseWrapper parseIntoResponseWrapper(List<String> res)
    {
        ResponseWrapper temp = new ResponseWrapper();
    	temp.responseCode = res[0];
    	temp.ResponseSubcode = res[1];
    	temp.ResponseReasonCode =res[2];
    	temp.ResponseReasonText=res[3];
    	temp.AuthorizationCode=res[4];
    	temp.AVSResponse= res[5];
    	temp.TransactionID=res[6];
    	temp.InvoiceNumber= res[7];
    	temp.Description= res[8];
    	temp.Amount= res[9];
    	temp.Method= res[10];
    	temp.TransactionType= res[11];
    	temp.CustomerID= res[12];
    	temp.FirstName= res[13];
    	temp.LastName= res[14];
    	temp.Company= res[15];
    	temp.Address= res[16];
    	temp.City= res[17];
    	temp.State= res[18];
    	temp.ZIPCode= res[19];
    	temp.Country= res[20];
    	temp.Phone= res[21];
    	temp.Fax= res[22];
    	temp.EmailAddress= res[23];
    	temp.ShipToFirstName= res[24];
    	temp.ShipToLastName= res[25];
    	temp.ShipToCompany= res[26];
    	temp.ShipToAddress= res[27];
    	temp.ShipToCity= res[28];
    	temp.ShipToState= res[29];
    	temp.ShipToZIPCode= res[30];
    	temp.ShipToCountry= res[31];
    	temp.Tax= res[32];
    	temp.Duty= res[33];
    	temp.Freight= res[34];
    	temp.TaxExempt= res[35];
    	temp.PurchaseOrderNumber= res[36];
    	temp.MD5Hash= res[37];
    	temp.CardCodeResponse= res[38];
    	temp.CardholderAuthenticationVerificationResponse= res[39];
    	temp.AccountNumber= res[40];
    	temp.CardType= res[41];
    	temp.SplitTenderID= res[42];
    	temp.RequestedAmount= res[43];
    	temp.BalanceOnCard= res[44];
    	return temp;
        
    }
    
    
    public class RequestWrapper{
        @auraenabled
        public string ordername{ get; set; }
        @auraenabled
    	public string ccnum{ get; set; }
        @auraenabled
    	public string ccexp{ get; set; }
        @auraenabled
    	public string ccsec{ get; set; }
        @auraenabled
    	public string amt{ get; set; }
        @auraenabled
    	public string firstname{ get; set; }
        @auraenabled
    	public string lastname{ get; set; }
        @auraenabled
    	public string billstreet{ get; set; }
        @auraenabled
    	public string billcity{ get; set; }
        @auraenabled
    	public string billstate{ get; set; }
        @auraenabled
    	public string billzip{ get; set; }
        @auraenabled
        public string billcontactNumber{get;set;}
        @auraenabled
        public string billcountry{get;set;}
        @auraenabled
    	public string transid{ get; set; }
        @auraenabled
    	public string routingnumber{ get; set; }
        @auraenabled
    	public string accountnumber{ get; set; }
        @auraenabled
    	public string bankaccounttype{ get; set; }
        @auraenabled
    	public string bankname{ get; set; }
        @auraenabled
    	public string bankaccountname{ get; set; }
    
        public RequestWrapper(){}
    
    }
    
    
    public class ProductDetailWrapper
    {
        @auraenabled
        public String productId{ get; set; }
        @auraenabled
        public Integer Quantity{ get; set; }
        public ProductDetailWrapper(){}
    }
    
    
    public class ResponseWrapper
    {
       public string responseCode {get;set;} //0
       public string ResponseSubcode{get;set;} //1
       public string ResponseReasonCode{get;set;} //2
       public string ResponseReasonText{get;set;} //3
       public string AuthorizationCode{get;set;} //4
       public string AVSResponse{get;set;} //5
       public string TransactionID{get;set;} //6
       public string InvoiceNumber{get;set;} //7
       public string Description{get;set;} //8
       public string Amount{get;set;} //9
       public string Method{get;set;} //10
       public string TransactionType{get;set;} //11
       public string CustomerID{get;set;} //12
       public string FirstName{get;set;} //13
       public string LastName{get;set;} //14
       public string Company{get;set;} //15
       public string Address{get;set;} //16
       public string City{get;set;} //17
       public string State{get;set;} //18
       public string ZIPCode{get;set;} //19
       public string Country{get;set;} //20
       public string Phone{get;set;} //21
       public string Fax{get;set;} //22
       public string EmailAddress{get;set;} //23
       public string ShipToFirstName{get;set;} //24
       public string ShipToLastName{get;set;} //25
       public string ShipToCompany{get;set;} //26
       public string ShipToAddress{get;set;} //27
       public string ShipToCity{get;set;} //28
       public string ShipToState{get;set;} //29
       public string ShipToZIPCode{get;set;} //30
       public string ShipToCountry{get;set;} //31
       public string Tax{get;set;} //32
       public string Duty{get;set;} //33
       public string Freight{get;set;} //34
       public string TaxExempt{get;set;} //35
       public string PurchaseOrderNumber{get;set;} //36
       public string MD5Hash{get;set;} //37
       public string CardCodeResponse{get;set;} //38
       public string CardholderAuthenticationVerificationResponse{get;set;} //39
       public string AccountNumber{get;set;} //40
       public string CardType{get;set;} //41
       public string SplitTenderID{get;set;} //42
       public string RequestedAmount{get;set;} //43
       public string BalanceOnCard{get;set;} //44
        
       ResponseWrapper(){}
    }
    
    public class client_response_wrapper{
        @auraenabled
        public string status;
        @auraenabled
        public string transaction_id;
         @auraenabled
        public string status_details;
        
        public client_response_wrapper(){}
    }

}