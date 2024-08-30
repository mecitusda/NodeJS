function update(input,operator){
    input.value +=operator;
    input.scrollLeft = input.scrollWidth;
    message.innerHTML="";
}

function last_isOperator(input,operator){
    const last=input.value[input.value.length-1];
    
    if(last === "+" || last === "-" || last === "*" || last === "÷" || last === "%"){
        if(operator !== last){
            input.value = input.value.slice(0, -1);
            update(input,operator);
        }
        message.innerHTML="You can't use two operators together!";
        return false;
    }
   
    update(input,operator);
    
}
document.addEventListener("DOMContentLoaded", () => {
    const string = document.getElementById("input");
    const _1 = document.getElementById("one");
    const _2 = document.getElementById("two");
    const _3 = document.getElementById("three");
    const _4 = document.getElementById("four");
    const _5 = document.getElementById("five");
    const _6 = document.getElementById("six");
    const _7 = document.getElementById("seven");
    const _8 = document.getElementById("eight");
    const _9 = document.getElementById("nine");
    const _0 = document.getElementById("zero");
    const _plus = document.getElementById("plus");
    const _minus = document.getElementById("minus");
    const _multiply = document.getElementById("multiply");
    const _DE = document.getElementById("DE");
    const point = document.getElementById("point");
    const percent = document.getElementById("percent");
    const equal = document.getElementById("equals");
    const AC = document.getElementById("AC");
    const slash = document.getElementById("slash");
    const message=document.getElementById("message");
    message.innerHTML="";
    _1.addEventListener("click", () => {
        update(string,"1");
    });
    _2.addEventListener("click", () => {
        update(string,"2");
    });
    _3.addEventListener("click", () => {
        update(string,"3");
    });
    _4.addEventListener("click", () => {
        update(string,"4");
    });
    _5.addEventListener("click", () => {
        update(string,"5");
    });
    _6.addEventListener("click", () => {
        update(string,"6");
    });
    _7.addEventListener("click", () => {
        update(string,"7");
        
    });
    _8.addEventListener("click", () => {
        update(string,"8");        
    });
    _9.addEventListener("click", () => {
        update(string,"9");
    });
    _0.addEventListener("click", () => {
        update(string,"0");        
    });
    _plus.addEventListener("click", () => {
       last_isOperator(string,"+");
    });
    _minus.addEventListener("click", () => {
        last_isOperator(string,"-");     
    });
    _multiply.addEventListener("click", () => {
        last_isOperator(string,"*");
    });
    AC.addEventListener("click", () => {
        string.value = "";
    });
    percent.addEventListener("click", () => {
        last_isOperator(string,"%");  
    });
    _DE.addEventListener("click", () => {
        string.value = string.value.slice(0, -1);
        string.scrollLeft = string.scrollWidth;
    });
    
    slash.addEventListener("click", () => {
        last_isOperator(string,"÷");
        
    });

    point.addEventListener("click", () => {
        let last = string.value[string.value.length-1];
        if(last !== "." && last.length !== 0){
            let tokens =string.value.match(/\./g)?string.value.match(/\./g):0;
            if(tokens){
                return false;
            }
            update(string,".");
        }
        
    });

    equal.addEventListener("click", () => {
        console.log(string.value);
        string.value = string.value.replace("÷","/"); // ÷ işaretini / işaretine çevirir
        let tokens = string.value.match(/(\d+(\.\d+)?|\+|\/|\-|\%|\*|\/)/g); // Sayıları ve operatörleri alır
        let stack = [];
       
        let currentOperator = '+';
        for (let token of tokens) {
            if (/\d+/.test(token)) {
                let num = parseFloat(token);
                if (currentOperator === '+') stack.push(num);
                if (currentOperator === '-') stack.push(-num);
                if (currentOperator === '*') stack.push(stack.pop() * num);
                if (currentOperator === '/') stack.push(stack.pop() / num);
                if(currentOperator === '%') stack.push((num/100)*stack.pop());
            } else {
                currentOperator = token;
            }
        }
        
        string.value = stack.reduce((acc, num) => acc + num, 0); 
    });

});

document.addEventListener("keydown", (event) => {
    
    let key = event.key; 
    const string = document.getElementById("input");
    if(key === "1"){
        update(string,"1");
    }
    if(key === "2"){
        update(string,"2");
    }
    if(key === "3"){
       update(string,"3");
    }
    if(key === "4"){
        update(string,"4");
    }
    if(key === "5"){
        update(string,"5");
    }
    if(key === "6"){
        update(string,"6");
    }
    if(key === "7"){
        update(string,"7");
    }
    if(key === "8"){
        update(string,"8");
    }
    if(key === "9"){
        update(string,"9");
    }
    if(key === "0"){
        update(string,"0");
    }
    if(key === "+"){
        last_isOperator(string,"+");
    }
    if(key === "-"){
        last_isOperator(string,"-");
    }
    if(key === "*"){
        last_isOperator(string,"*");
    }
    if(key === "/"){
        last_isOperator(string,"÷");
    }
    if(key === "."){
        let last = string.value[string.value.length-1];
        if(last !== "." && last.length !== 0){
            let tokens =string.value.match(/\./g)?string.value.match(/\./g):0;
            if(tokens){
                return false;
            }
            update(string,".");
        }
    }
    if(key === "%"){
        last_isOperator(string,"%");
    }
    if(key === "Enter"){
        document.getElementById("equals").click();
    }
    if(event.ctrlKey && key === "a"){ 
        document.getElementById("input").select();
    }
    
    if(document.getElementById("input").selectionStart === 0 && document.getElementById("input").selectionEnd === document.getElementById("input").value.length && key === "Backspace"){
        document.getElementById("input").value = "";
        
    }
    if(key === "Backspace"){
        document.getElementById("input").value =  document.getElementById("input").value.slice(0, -1);
        string.scrollLeft = string.scrollWidth;
    }
})