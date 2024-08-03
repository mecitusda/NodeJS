function checkvalidate_username(input){
  
  if(input.value.length>7 && input.value.length<20 && !input.value.match(/@/)){
    
      return true;
  }
  return false;
}

function checkvalidate_password(input){
  
  if(input.value.length>7 && input.value.length<20 && input.value.match(/[a-z]/g) && input.value.match(/[A-Z]/g) && input.value.match(/[0-9]/g) && input.value.match(/[^a-zA-Z\d]/g)){
      return true;
  }
  return false;
}

function checkvalidate_email(input,lastmail){

  input=input.value+lastmail.value;
  console.log(input);
  if(input.length>14 && input.length<50 && input.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)){
      return true;
  }
  return false;
}

function validateInput(input) {

  if (!input.checkValidity()) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
  } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
  }
}
function checkusername(username){
  if(checkvalidate_username(username)){
    username.classList.remove('is-invalid');
    username.classList.add('is-valid');}

else{
username.classList.add('is-invalid');
username.classList.remove('is-valid'); }
}  

function checkpassword(password){
  if(checkvalidate_password(password)){
    password.classList.remove('is-invalid');
    password.classList.add('is-valid');}

  else{
      password.classList.add('is-invalid');
      password.classList.remove('is-valid');
  }
}

function checkemail(email,lastmail){
  
  if(checkvalidate_email(email, lastmail)){
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');}
    
    else{
    email.classList.add('is-invalid');
    email.classList.remove('is-valid');
    }
}
document.addEventListener("DOMContentLoaded", () => { 
  
    const form=document.getElementById("add-admin-form");
    const username=document.getElementById("username");
    const password=document.getElementById("password");
    var email=document.getElementById("email");
    const lastmail=document.getElementById("email_option");
    
    
   

    
    username.addEventListener("input",() => {
      if(username.value.length === 0)
      {
        username.classList.remove('is-invalid');
        username.classList.remove('is-valid');
      }

      else{
       checkusername(username);
      
       }
      });
      

    password.addEventListener("input",() => {

        if(password.value.length === 0)
          {
            password.classList.remove('is-invalid');
            password.classList.remove('is-valid'); 
          }
         
        else{
            checkpassword(password);
          
        }
        

      });

    email.addEventListener("input",() => {
      

        if(email.value.length === 0 || lastmail.value === -1){
          console.log("girdi")
          email.classList.remove('is-invalid');
          email.classList.remove('is-valid');}
          
        else{ 
          checkemail(email,lastmail);
        }
      
      });


    form.addEventListener("submit",async (e) => {
        
      if(username.classList.contains('is-valid') && password.classList.contains('is-valid') && email.classList.contains('is-valid')){
        
      }
      else{
        e.preventDefault();
        if(!checkvalidate_username(username)){
        username.focus.apply(username);}
        else if(!checkvalidate_password(password)){
          password.focus.apply(password);}
        else if(!checkvalidate_email(email,lastmail)){
          email.focus.apply(email);}



      }

      

    });

});