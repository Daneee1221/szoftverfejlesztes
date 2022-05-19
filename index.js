let map;

var markers = [];
var uniqueId = 1;
var latlong = 0;
var latlong2 = 0;

function initMap() {
    const x =47.09;
    const y = 17.91;
    const myLatLng = { lat: x, lng: y };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: myLatLng,
    });


    google.maps.event.addListener(map, 'click', function (e) {

      var location = e.latLng;
      if(uniqueId<2)
      {
      var marker = new google.maps.Marker({
          position: location,
          map: map
      });
      }
      else{
        window.alert("Csak egy pontot tud kijelölni!");
      }
    marker.id = uniqueId;
    uniqueId++; 

    google.maps.event.addListener(marker, "click", function (e) {

      if(uniqueId==2){
        var pont = 'Kiválasztott pont<br>';
      }
      var content = pont;
        content += 'Szélesség: ' + location.lat() + '<br />Hosszúság: ' + location.lng();
        var latitude = location.lat();
        var longitude = location.lng();
        if(uniqueId==2){
          latlong = {
            lat1: location.lat(),
            long1 : location.lng()
          }
        }
        content += "<br /><input type = 'button' va;ue = 'Delete' onclick = 'DeleteMarker(" + marker.id +");' value = 'Delete' />";
        content += "<input type = 'button' id = 'submit' onclick = 'showMarker("+latitude+','+longitude+")' value ='Kiválaszt' />";
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        infoWindow.open(map, marker);
      }
      
    
    );  
    markers.push(marker);
  });
  
  }

  function showMarker(latitude,longitude)
  {
    showLatitude(latitude);
    showLongitude(longitude);
  }
  function showLatitude(latitude)
  {
    document.getElementById('szel').innerHTML = latitude;
  }
  function showLongitude(longitude)
  {
    document.getElementById('hossz').innerHTML = longitude;
  }

  function DeleteMarker(id,uniqueId) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id == id) {
                             
            markers[i].setMap(null);
            markers.splice(i, 1);
            if(id==2){
              id--;
            }
            return;
        }
    }
  }

  function calculation()
  {
    var szelesseg = parseFloat(document.getElementById("szel").innerHTML);
    console.log(szelesseg)
    var hossz = parseFloat(document.getElementById("hossz").innerHTML);
    var terulet = document.getElementById('terulet').value;
    var dy = terulet/2;
    var dx = terulet/2;
    console.log(dy)
    console.log((180/3.14)*(dy/6378));

    //jobb felso

    var max_szel = szelesseg + (180/3.14)*(dy/6378137);
    console.log(max_szel)

    //bal also
    var min_szel = szelesseg - (180/3.14)*(dy/6378137);
    console.log(min_szel)
    //jobb also
    var max_hossz = hossz + (180/3.14)*(dx/6378137)/Math.cos(hossz);
    console.log(max_hossz)
    //bal felso
    var min_hosz = hossz - (180/3.14)*(dx/6378137)/Math.cos(hossz);


    var adatok = [{'max_szel': max_szel, 'min_szel': min_szel,'max_hossz': max_hossz,'min_josz': min_hosz}];

    run(max_szel,min_szel,max_hossz,min_hosz);



    //document.getElementById('asd').innerHTML = 'Az új kiválaszott  fokok: '+lat +"; "+lon;


  }



  function run(max_szel,min_szel,max_hossz,min_hosz)
  {
    $.ajax({
      type: "GET",
      responseType: "json",
      url: "http://localhost:5000/save",
      data: {max_szel: Number(max_szel) , min_szel: Number(min_szel), max_hossz: Number(max_hossz), min_hosz:Number(min_hosz)},
    }).done(function( o ) {
       console.log("vissza: "+o);
    });

  }