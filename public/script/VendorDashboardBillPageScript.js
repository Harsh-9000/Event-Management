function calculate() {
    var x = document.getElementById("price").value;

    var result = Math.ceil((18 / 100) * x);

    document.getElementById("gst").value = result;

    var total = Number(x) + Number(result);

    document.getElementById("total-price").value = total;
}