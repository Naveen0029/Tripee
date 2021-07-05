

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
            if(Item.length<=0)return;
            //check if item is already present
            for(let i=0;i<data.length;i++){
                if(data[i]===Item)return;
            }
         
            data.push(Item);
            return data;
        },
        getData:function(){
            return data;
        },
        addDetailedInfo:function(payer,payee,amount){
             detailedData.push(new details(payer,payee,amount));
             return detailedData;
        },


        upheapify:function(heap,idx){
    
            if(idx<=0)return;
            var pi=Math.floor((idx-1)/2);
            if(heap[pi].first<heap[idx].first){
                var temp=heap[pi];
                heap[pi]=heap[idx];
                heap[idx]=temp;
               this.upheapify(heap,pi);
            }
            else return;
        
        },
        downheapify:function(heap,idx){
        
            var lc=2*idx+1;
            var rc=2*idx+2;
            if(lc>=heap.length&&rc>=heap.length)return;
            var largest=idx;
            if(lc<heap.length&&heap[lc].first>heap[largest].first){
                largest=lc;
            }
            if(rc<heap.length&&heap[rc].first>heap[largest].first){
                largest=rc;
            }
            if(largest==idx)return;
        
            var temp=heap[largest];
            heap[largest]=heap[idx];
            heap[idx]=temp;
            this.downheapify(heap,largest);
        },
        push_heap:function(heap,val,key){
         
            var ob={"first":val,"second":key};
            heap.push(ob);
            this.upheapify(heap,heap.length-1); 
            
        },
        pop_heap:function(heap){
        
            if(heap.length==0)return;
            var i=heap.length-1;
            var temp=heap[0];
            heap[0]=heap[i];
            heap.pop();
            this.downheapify(heap,0);
        
        },
        heap_top:function(heap){
            
            if(heap.length==0){
                return;
            }
            return heap[0];
        },


        getSimplifiedTransactions:function(){
            var net_balance={};//hashmap or object
            for(let i=0;i<detailedData.length;i++){
                var temp=detailedData[i];
                if(temp.payer in net_balance){
                    net_balance[temp.payer]+=temp.amount;
                }
                else {
                    net_balance[temp.payer]=temp.amount;
                }

                if(temp.payee in net_balance){
                    net_balance[temp.payee]-=temp.amount;
                }
                else{
                    net_balance[temp.payee]=-temp.amount;
                }
            }
            console.log(net_balance);
          
            positive=[];//heap of credit holders
            negative=[];//heap of debit holders
            for(const p in net_balance){
                 if(net_balance[p]>0){
                     this.push_heap(positive,net_balance[p],p);
                 }
                 else{
                     this.push_heap(negative,-1*net_balance[p],p);
                 }
            }

            var result=[];//array of expense objects

            while(positive.length>0){
                var p1=this.heap_top(positive);
                var p2=this.heap_top(negative);
                console.log(p1);
                console.log(p2);
                this.pop_heap(positive);
                this.pop_heap(negative);
                let exp=new details(p2.second,p1.second,Math.min(p1.first,p2.first));
                console.log(exp);
                result.push(exp);
                if(p1.first>p2.first){
                   this.push_heap(positive,p1.first-p2.first,p1.second);
                }else if(p1.first<p2.first){
                   this.push_heap(negative,p2.first-p1.first,p2.second);
                }
            }
            return result;

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
        TransactionAmount:'#amount__detail',
        entrBtn3:'#simply_details_button',
        SimplyPayee:'#simply_payee',
        SimplyPayer:'#simply_payer',
        SimplyAmount:'#simply_amount_detail',
        NameContainer:'#input_details',
        WhoPay:'#who_pay',
        SimplifiedConatiner:'#simplified_details',
        ChoosedPeople:'#choose_people',
        SimplyPrintDetails:'#simply_print_details'


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
  
            document.querySelector(DOMstrings.Submitdetails).style.display="block";//show the button when their is name available
           
        
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
            var newpayee=payeehtml.replace('%ID%',i+1); 
            newpayee=newpayee.replace('%val%',i+1);
            newpayee=newpayee.replace('%Payeename%',info[i]);
            document.querySelector(DOMstrings.payee).insertAdjacentHTML('beforeend',newpayee);
            }
            document.querySelector(DOMstrings.Submitdetails).style.display="none";//hiding the Button
            document.querySelector(DOMstrings.NameContainer).style.display="none";//hiding the name container
            document.querySelector(DOMstrings.WhoPay).style.display="block";//show whopay container
            
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
                  
                 
                 if(detailed[lastId].payer===detailed[lastId].payee){
                     alert("Payer and Payee can not be same");
                     return;
                 }
                 else if(detailed[lastId].payer==='payer'){
                     alert('Please add the payer');
                     return ;
                 }
                 else if(detailed[lastId].payee==='payee'){
                     alert('Please add the payee');
                     return;
                 }
                 else if(isNaN(detailed[lastId].amount)){
                     alert('Please add a valid amount');
                     return;
                 }

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
            
        },
        printFinalResults:function(arr){
                
                

                for(let i=0;i<arr.length;i++){

                   console.log(arr[i]); 
                    let html1='<p>%name%</p>';
                    let transPayerName=html1.replace('%name%',arr[i].payer);
                    document.querySelector(DOMstrings.SimplyPayer).insertAdjacentHTML('beforeend',transPayerName);
                    let html2='<p>%name%</p>';
                    let transPayeeName=html2.replace('%name%',arr[i].payee);
                    document.querySelector(DOMstrings.SimplyPayee).insertAdjacentHTML('beforeend',transPayeeName);
                    let html3='<p>%amount%<p>';
                    let transAmount=html3.replace('%amount%',arr[i].amount);
                    document.querySelector(DOMstrings.SimplyAmount).insertAdjacentHTML('beforeend',transAmount);
                }
               document.querySelector(DOMstrings.SimplifiedConatiner).style.display='block';//show simplified container
 
        },
         removeChilds :(parent) => {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        },
        RemoveChild:function(){
            let x=document.querySelector(DOMstrings.SimplyPayer);
            let y=document.querySelector(DOMstrings.SimplyPayee);
            let z=document.querySelector(DOMstrings.SimplyAmount);
            this.removeChilds(x);
            this.removeChilds(y);
            this.removeChilds(z);
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
       document.querySelector(DOM.entrBtn3).addEventListener('click',printFinalResult);

       //document.querySelector(DOM.ChoosedPeople).addEventListener('click',RemoveThechosenone);

    }
    var ctrlAddItem=function(){
        var newInput=[];
        //getting the value from ui(input-data)
        var input=UIctrl.getInput().value;
        
        if(input.length<=0)return;

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
        var details=[],finalResult=[];
        //get detailed information from UI payer,payee,amount
        var detailedInput=UIctrl.getDetailedInput();
        //Add the item to the tripee payer,payee,amount
        console.log(typeof(detailedInput.amount));
          details=tripCtrl.addDetailedInfo(detailedInput.sel_payer,detailedInput.sel_payee,
            detailedInput.amount);
         
        //Add the item to the UI
          UIctrl.addDetailedListItem(details);
        
    }
    var printFinalResult=function(){
        //calculate simplified transactions
        finalResult=tripCtrl.getSimplifiedTransactions();
        //Remove the childs(old details)
        UIctrl.RemoveChild();
        //Print final result in the UI
        UIctrl.printFinalResults(finalResult);
    }
    var RemoveThechosenone=function(event){
           console.log(event.target);
    }
    return {
        init:function(){
            console.log('apllication started');
            setupEventListener();
        }
    }
})(tripeeController,UIcontroller);

controller.init();  