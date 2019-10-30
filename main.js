

var container = document.getElementsByClassName("container")[0];
let submitBtn = document.getElementsByClassName("submit-Btn");
let inputSymbols = document.getElementsByClassName("input-Symbols");


//XML/Http Request

let query = func => {

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      xhr.open("GET" || func.method, func.url);

      if (func.headers) {
        Object.keys(func.headers).forEach(key => {

          xhr.setRequestHeader(key, func.headers[key]);

        });
      }


//load
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);

      xhr.send(func.body);
    });
  };

  //To get JSON data from the API server
  var observe = {
    next: function(value) {
      var inputStockSymbols = inputSymbols[0].value;
      console.log();
      //this will callback our query function
      query({
        url: `https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=demo`
      })
        .then(response => {
          console.log(response);
          var stocktable = document.getElementsByClassName("stockListTable")[0];
          if (typeof stocktable != "undefined" && stocktable != null) //checking if it exits 
          {
            container.removeChild(stocktable);
          }
          var inputSymbolsArray = inputStockSymbols.split(",");
          var filteredData = response.data.filter(f =>

            inputSymbolsArray.includes(f.symbol)
          );
          
          Table(filteredData);
        })
        .catch(e => {
          console.log(e);
        });
    },

    error: function(e) {
      console.log(e);
    },

    complete: function() {
      console.log("Completed");
    }
  };


  // method to generate table from the json output
function Table(stockDetailsArray) {
    //Build an array containing Customer records.


    var table = document.createElement("table"); //creating table

    table.setAttribute("class", "stockListTable");//setting attributes

    table.border = "10";

   table.cellPadding = "15px";
  
    //Ading the header row.

    var row = table.insertRow(-1);


    for (var key in stockDetailsArray[0]) {

      var headerRow = document.createElement("th");

      headerRow.innerHTML = key;

      row.appendChild(headerRow);
    }
  
    //Add the data rows.

    for (var i = 0; i < stockDetailsArray.length; i++) {

      row = table.insertRow(-1);
      for (var key in stockDetailsArray[i]) {
        var cell = row.insertCell(-1);
        cell.innerHTML = stockDetailsArray[i][key];
      }
    }
    container.appendChild(table);
  }
  function unsubscribeSubmitbtn() {
    console.log("unload");

  //cancelling the abservable

    subscriberObject.unsubscribe();
  }


  // event listener observer for click submit button using Rxjs
  var subscriberObject = Rx.Observable.fromEvent(submitBtn, "click").subscribe(observe);
  window.onunload = unsubscribeSubmitbtn;

