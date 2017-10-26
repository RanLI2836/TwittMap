var map;
var heatmap;
var shownMarker = new Array();
var heatpoints = new Array();
var showCircle = null;
var current = null;
var delay = 30;

$('#hotword-Selector').change(function() {
    selected($('#hotword-Selector').val());
});

function selected(word) {
	clearAllMarkers();
	$.ajax({
		type: 'GET',
		url: 'keyword',
		data: {
			'keyword': word
		},
		dataType: 'json',
		success: function(data) {
			console.log("get data from server");
			data.forEach(function(element, i){
				window.setTimeout(function(){
          var location = {lat: element._source.geo.lat, lng: element._source.geo.lon};
          var myMarker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.BOUNCE
          });
          shownMarker.push(myMarker);
          var myLatLng = new google.maps.LatLng({lat: element._source.geo.lat, lng: element._source.geo.lon}); 
          var inforwindow = new google.maps.InfoWindow({
            content: "<b>" + element._source.screen_name + "</b></br>" + element._source.created_time + "</br>" + element._source.content,
            position:  myLatLng
          });
          google.maps.event.addListener(myMarker,'click', function() {
            if (current != null) {
              current.close();
            }
            inforwindow.open(map, myMarker);
            current = inforwindow;
        }, i*delay);

 				});
			});
		}
	});
}


function initMap() {
	var uluru = {lat: -25.363, lng: 131.044};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: uluru,
		styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#537486"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#004d64"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#003649"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#006d8e"
      }
    ]
  }
]

	});

  new google.maps.event.addListener(map, "click", function(event){
    if (document.getElementById("diffFeature").checked) {
      // console.log(event.latLng.lat())
      esearch(event.latLng.lat(), event.latLng.lng());
    }
  });

}

function setAllMarkers(map) {
	for (var i = 0; i < shownMarker.length; i++) {
		shownMarker[i].setMap(map);
	}
}

function clearAllMarkers() {
	setAllMarkers(null);
	shownMarker = [];
}

// elastic search according to the location that the user click
function esearch(lat, lng) {
  if (showCircle != null) {
    // console.log("aaaaaaaaaaa")
    showCircle.setMap(null);
    console.log(showCircle);
  }
  // console.log("heatpoints", heatpoints);
  heatpoints = [];
  console.log("clear", heatpoints);
  if (heatmap) {
    // console.log("mmmmmmmm")
    heatmap.setMap(null);
    heatmap.setData([]);
    console.log("heatmap", heatmap);
  }

  clearAllMarkers(null);
  // console.log("bbbbb")
  showCircle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: {lat: lat, lng: lng},
    radius: 1000000
  })

  $.ajax({
    type: 'GET',
    url: 'geospatial',
    data: {
      'lat': lat,
      'lng': lng
    },
    dataType: 'json',
    success: function(data) {
      console.log("click lat", lat);
      console.log("elastic search data", data);
      data.forEach(function(element, i) {
        window.setTimeout(function() {
          var location = {lat: element._source.geo.lat, lng: element._source.geo.lon};
          var myMarker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.DROP
          });
          shownMarker.push(myMarker);

          var myLatLng = new google.maps.LatLng({lat: element._source.geo.lat, lng: element._source.geo.lon}); 
          heatpoints.push(myLatLng);
          var inforwindow = new google.maps.InfoWindow({
            content: "<b>" + element._source.screen_name + "</b></br>" + element._source.created_time + "</br>" + element._source.content,
            position:  myLatLng
          });
          google.maps.event.addListener(myMarker,'click', function() {
            if (current != null) {
              current.close();
            }
            inforwindow.open(map, myMarker);
            current = inforwindow;
          });
        }, i*delay);

        window.setTimeout(function() {
          if (heatmap) {
            heatmap.setMap(null);
          }
          // console.log("heatpoints", heatpoints);
          heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatpoints,
            dissipating: false,
            map: map
          });
          heatmap.setOptions({
            opacity: 0.5,
            radius: 10,
            maxIntensity: 10,
          });
          heatmap.setMap(map);
        }, data.length * delay);
      })
    }
  });
}


