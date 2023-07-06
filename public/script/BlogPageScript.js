let quoteindex = 0;
quoteslide();

function quoteslide() {
  let j;
  let slides = document.getElementsByClassName("trendboxnone");
  for (j = 0; j < slides.length; j++) {
    slides[j].style.display = "none";
  }
  quoteindex++;
  if (quoteindex > slides.length) {
    quoteindex = 1
  }
  slides[quoteindex - 1].style.display = "flex";
  setTimeout(quoteslide, 2500);
}



let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  slides[slideIndex - 1].style.display = "flex";
  setTimeout(showSlides, 2500);
}

function validation() {
  let input_name = document.getElementById("fname").value;
  let true_name = /^[a-zA-Z]* *[a-zA-Z]* *[a-zA-Z]*$/;
  let input_email = document.getElementById("email").value
  let true_email = /[a-zA-Z0-9]*@gmail\.com/
  let input_usernum = document.getElementById("usernum").value
  let true_usernum = /^[0-9]{10}$/


  if (input_name == "") {
    alert("Name cannot be empty")
    return false
  }
  else if (!input_name.match(true_name)) {
    alert("Valid only Letters in name");
    return false;
  }
  else if (input_email == "") {
    alert("E-Mail cannot be empty")
    return false
  }
  else if (!input_email.match(true_email)) {
    alert("Invalid E-Mail format")
    return false
  }
  else if (input_usernum == "") {
    alert("Contact Number cannot be empty")
    return false
  }
  else if (!input_usernum.match(true_usernum)) {
    alert("Invalid Contact number")
    return false
  }
  else {
    alert("You will get a call soon! Thankyou for choosing us")
    return true
  }
}
