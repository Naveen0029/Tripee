//Tripee Controller
var tripeeController = (function(){
    var details=function(payer,payee,amount){
        this.payer=payer;
        this.payee=payee;
        this.amount=amount;
    }
    var data=[];
    var detailedData=[];

    return {
        addItem:function(Item){
           
            data.push(Item);
            return data;
        },
        getData:function(){
            return data;
        },
        addDetailedInfo:function(payer,payee,amount){
             detailedData.push(new details(payer,payee,amount));
             return detailedData;
        }
    }
})();

//UI Controller
var UIcontroller = (function(){
    var DOMstrings={
        entrBtn:'#get_details_button1',
        inputText:'#entered_details',
        Addname:'#add_name',
        Submitdetails:'#submit_details',
        payer:"#inlineFormSelectPref1",
        payee:'#inlineFormSelectPref2',
        addedAmount:'#added_amount',
        entrBtn2:'#get_details_button2',
        TransactionPayer:'#payer__name',
        TransactionPayee:'#payee__name',
        TransactionAmount:'#amount__detail'


    };

    return {
        getInput:function(){
            return {
                value:document.querySelector(DOMstrings.inputText).value
            }
        },
        getDOMstrings:function(){
            return DOMstrings;
        },
        addListItem:function(input){
            var input;
            if(input.length>0){
                lastId=input.length-1;

            }
            else lastId=0;
            console.log(input);
            var html='<h4 id="name_%val%">%name%</h4>';
            var newhtml=html.replace('%val%',lastId);
            newhtml=newhtml.replace('%name%',input[lastId]);
            console.log(newhtml);
            document.querySelector(DOMstrings.Addname).insertAdjacentHTML('afterbegin',newhtml);
  
            document.querySelector(DOMstrings.Submitdetails).style.display="block";
        
        },
        clearFields:function(){
            document.querySelector(DOMstrings.inputText).value="";
        },
        addPayeeAndPayer:function(info){
            for(let i=0;i<info.length;i++){
            var payerhtml='<option value="%val%" id="payerr_%ID%">%Payername%</option>';
            var newpayer=payerhtml.replace('%ID%',i+1);
            newpayer=newpayer.replace('%val%',i+1);
            newpayer=newpayer.replace('%Payername%',info[i]);
            document.querySelector(DOMstrings.payer).insertAdjacentHTML('beforeend',newpayer);
            var payeehtml='<option value="%val%" id="payeee_%ID%">%Payeename%</option>';
            var newpayee=payerhtml.replace('%ID%',i+1);
            newpayee=newpayee.replace('%val%',i+1);
            newpayer=newpayer.replace('%Payeename%',info[i]);
            document.querySelector(DOMstrings.payee).insertAdjacentHTML('beforeend',newpayer);
            }
            
        },
        getDetailedInput:function(){
            var x=document.querySelector(DOMstrings.payer); 
            var y=document.querySelector(DOMstrings.payee);
            
            return {
                sel_payer:x.options[x.selectedIndex].textContent,
                sel_payee:y.options[y.selectedIndex].textContent,
                amount:parseInt(document.querySelector(DOMstrings.addedAmount).value)
            }
           
        },
        addDetailedListItem:function(detailed){
                 let lastId;
                 if(detailed.length>0){
                     lastId=detailed.length-1;
                 }
                 else lastId=0;

                 let i=lastId;
                var html1='<p>%name%</p>';
                var transPayerName=html1.replace('%name%',detailed[i].payer);
                document.querySelector(DOMstrings.TransactionPayer).insertAdjacentHTML('beforeend',transPayerName);
                var html2='<p>%name%</p>';
                var transPayeeName=html2.replace('%name%',detailed[i].payee);
                document.querySelector(DOMstrings.TransactionPayee).insertAdjacentHTML('beforeend',transPayeeName);
                var html3='<p>%amount%<p>';
                var transAmount=html3.replace('%amount%',detailed[i].amount);
                document.querySelector(DOMstrings.TransactionAmount).insertAdjacentHTML('beforeend',transAmount);   
            
        }
    }
})();

//Global App Controller
var controller = (function(tripCtrl,UIctrl){
    var DOM=UIctrl.getDOMstrings();

    var setupEventListener = function(){
        document.querySelector(DOM.entrBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13|| event.which === 13){//if enter is pressed
            ctrlAddItem();
          }      
       });
       document.querySelector(DOM.Submitdetails).addEventListener('click',changePayerAndPayee);
       document.querySelector(DOM.entrBtn2).addEventListener('click',ctrlDetailedaddItem);

    }
    var ctrlAddItem=function(){
        var newInput=[];
        //getting the value from ui(input-data)
        var input=UIctrl.getInput().value;
        //Add the iten to the Tripee
        newInput=tripCtrl.addItem(input);
        //Add the item to the UI
        UIctrl.addListItem(newInput);
        //clear the fields
        UIctrl.clearFields();
       
    }
    var changePayerAndPayee=function(){
        
         //add the payee and payer
        UIctrl.addPayeeAndPayer(tripCtrl.getData());
    }
    var ctrlDetailedaddItem=function(){
        var details=[];
        //get detailed information from UI payer,payee,amount
        var detailedInput=UIctrl.getDetailedInput();
        //Add the item to the tripee payer,payee,amount
          details=tripCtrl.addDetailedInfo(detailedInput.sel_payer,detailedInput.sel_payee,
            detailedInput.amount);

        //Add the item to the UI
          UIctrl.addDetailedListItem(details);
        

    }
    return {
        init:function(){
            console.log('apllication started');
            setupEventListener();
        }
    }
})(tripeeController,UIcontroller);

controller.init();  