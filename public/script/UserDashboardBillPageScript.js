var x = document.getElementById("user-price").value;

var result = Math.ceil((18 / 100) * x);

document.getElementById("user-gst").value = result;

var total = Number(x) + Number(result);

document.getElementById("user-total-price").value = total;
