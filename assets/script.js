// variable list
var cityList =$("#city-list");
var tdyWthr = document.querySelector("#today-weather");
var storedCities = [];
var cities = [];
var key = "debf7274afd7565937ec16d5e82c989f";

tdyWthr.style.display= "none";

// format the day
function FormatDay(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    var dayDay = (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day + '/' +
                    date.getFullYear();
            return dayDay;
}

init();
//init function
function init(){
    //storing cities in localStorage
    //JSON parse
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // update cities to local storage
    if (storedCities !== null) {
        cities = storedCities;
      }
    // DOM those cities
    renderCities();
}

function storeCities(){
    // stringify and set to localstorage
   localStorage.setItem("cities", JSON.stringify(cities));
   console.log(localStorage);
 }
 
function renderCities() {
    // clear cities
    cityList.empty();
    
    // new LI creation
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      var li = $("<li>").text(city);
      li.attr("id","listC");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      cityList.prepend(li);
    }
    //retrieve weather for first city
    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   

  //form submission
  $("#add-city").on("click", function(event){
      event.preventDefault();

    // retrieving value from city box
    var city = $("#city-input").val().trim();
    
    // reset if input is nada
    if (city === "") {
        return;
    }
    //city-input to the city array
    cities.push(city);
    // render again the stored cities and display hidden data
  storeCities();
  renderCities();
  tdyWthr.style.display= "block";
  });

  //Function to get weather 
  
  function getResponseWeather(cityName){
    var URLQuery = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + key; 

    //Clear today weather
    $("#today-weather").empty();
    $.ajax({
      url: URLQuery,
      method: "GET"
    }).then(function(response) {
        
      // creating box for today's weather
      cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
      $("#today-weather").append(cityTitle);
      var temperatureCon = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Temperature: "+ temperatureCon + "°F");
      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + "%");
      $("#today-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#today-weather").append(cityWindSpeed);
      var CoordLon = response.coord.lon;
      var CoordLat = response.coord.lat;
      tdyWthr.style.display= "block";
    
        //UV index API
        var URLQueryy = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + CoordLat +"&lon=" + CoordLon;
        $.ajax({
            url: URLQueryy,
            method: "GET"
        }).then(function(uvResponse) {
            var cityUV = $("<span>").text(uvResponse.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);
            console.log(typeof uvResponse.value);
            if(uvResponse.value > 0 && uvResponse.value <=2){
                cityUV.attr("class","green")
            }
            else if (uvResponse.value > 2 && uvResponse.value <= 5){
                cityUV.attr("class","yellow")
            }
            else if (uvResponse.value >5 && uvResponse.value <= 7){
                cityUV.attr("class","orange")
            }
            else if (uvResponse.value >7 && uvResponse.value <= 10){
                cityUV.attr("class","red")
            }
            else{
                cityUV.attr("class","purple")
            }
        });
        
        //5 day forecast 
        var URLQueryyy = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
            $.ajax({
            url: URLQueryyy,
            method: "GET"
        }).then(function(response5day) { 
            $("#boxes").empty();
            console.log(response5day);
            for(var i=0, j=0; j<=4; i=i+7){
                var read_date = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var FivedayDiv = $("<div>");
                    FivedayDiv.attr("class","col-3 m-2 bg-primary")
                    var d = new Date(0);
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayDay = (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day + '/' +
                    date.getFullYear();
                    var Fivedayh4 = $("<h5>").text(dayDay);
                    //weather image
                    var imgtag = $("<img>");
                    var skyconditions = response5day.list[i].weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyconditions==="Clear"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyconditions==="Rain"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var temperatureEl = response5day.list[i].main.temp;
                    console.log(skyconditions);
                    var temperatureCon = parseInt((temperatureEl)* 9/5 - 459);
                    var pTemperature = $("<p>").text("Temperature: "+ temperatureCon + "°F");
                    var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + "%");
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(imgtag);
                    FivedayDiv.append(pTemperature);
                    FivedayDiv.append(pHumidity);
                    $("#boxes").append(FivedayDiv);
                    console.log(response5day);
                    j++;
                }
            
        }
      
    });
      

    });
    
  }

  //LI click event
  $(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getResponseWeather(thisCity);
  });

//   clear history button function
  function clearHistory(event){
    event.preventDefault();
    storedCities=[];
    localStorage.removeItem("cities");
    document.location.reload();
  }

  $("#clear-history").on("click",clearHistory);