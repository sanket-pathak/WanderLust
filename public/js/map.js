

    //
    //console.log("Coords:", coords);
//console.log("Title:", title);
//console.log("Location:", location);

/*const loc=listing.location;
const title = listing.title;

let lat, lon;
if( listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2){
 lon = listing.geometry.coordinates[0];
 lat = listing.geometry.coordinates[1];
}else{
  // lon= 77.2088;
  // lat=28.6139;
  // use geocoding to get coordinates
  const encodedLoc = encodeURIComponent(loc);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLoc}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
         lat = parseFloat(data[0].lat);
         lon = parseFloat(data[0].lon);
       
      } else {
        console.error('Location not found, using fallback coordinates');
        renderMap(28.6139, 77.2088); // Fallback: Delhi
      }
    })
    .catch(err => {
      console.error('Geocoding error:', err);
      renderMap(28.6139, 77.2088); // Fallback
    });
}


  const map = L.map('map').setView([lat, lon], 13); 
 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${title}</b><br>${loc}`)
    .openPopup();*/

    const loc = listing.location;
const title = listing.title;

function renderMap(lat, lon) {
  const map = L.map('map').setView([lat, lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(`<b>${title}</b><br>${loc}`)
    .openPopup();
}

// If geometry exists, use it
if (
  listing.geometry &&
  listing.geometry.coordinates &&
  listing.geometry.coordinates.length === 2
) {
  const lon = listing.geometry.coordinates[0];
  const lat = listing.geometry.coordinates[1];
  renderMap(lat, lon);
} else {
  // Otherwise, use geocoding to get coordinates
  const encodedLoc = encodeURIComponent(loc);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLoc}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        renderMap(lat, lon);
      } else {
        console.error('Location not found, using fallback coordinates');
        renderMap(28.6139, 77.2088); // Fallback: Delhi
      }
    })
    .catch(err => {
      console.error('Geocoding error:', err);
      renderMap(28.6139, 77.2088); // Fallback
    });
}

