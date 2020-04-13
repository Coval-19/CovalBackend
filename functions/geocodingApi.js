const functions = require('firebase-functions');
const request = require('request-promise');

exports.getGeoLocation = (address) => {
  const apiToken = functions.config().google_cloud_platform.key

  const params = {
    address: address.split(' ').join('+'),
    key: apiToken
  }

  const getQueryParams = Object.entries(params).map(([k, v]) => k+'='+v).join('&')

  const url = 'https://maps.googleapis.com/maps/api/geocode/json?' + getQueryParams

  console.log(url)

  return request({
    url: url,
    json: true,
  }).then(response => {
    console.log(response)
    const location = response.results[0].geometry.location
    return location // [location.lat, location.lng]
  })
}
