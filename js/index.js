$(document).ready(function(){

    $.ajax
    ({
      type: "GET",
      url: "http://localhost:8080/api/accounts",
      success: function(response)
      {
          let rows = "";
          let total = 0;
       response.forEach(element => {
        total += parseFloat(element.balance); 
        let bl = parseFloat(element.balance).toFixed(2);
        let currBalance =  bl< 0.00 ? `-ZAR ${bl}` :  `ZAR ${bl}`
        let btnColor = "btn-success";
        let disabled = "";
        if(bl < 0){
            btnColor = "btn-light";
            disabled = "disabled";
        }
        rows += `<tr> 
                <td> ${element.account_number} </td>
                <td> ${element.account_type} </td>
                <td> ${currBalance} </td>
                <td> <button ${btnColor} class="btn ${btnColor}" onclick="withdraw()">Withdraw </button></td>
                </tr>`
       });
       $('#accounts tbody').html(rows)
       let totalBal = total.toFixed(2) < 0.0 ? `-ZAR ${total.toFixed(2)}` :  `ZAR ${total.toFixed(2)}`
       $('#accounts tfoot th:nth(2)').html(totalBal)
      }
    });
  });

  function withdraw(){
      alert('success')
  }