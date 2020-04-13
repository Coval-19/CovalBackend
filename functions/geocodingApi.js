const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');

const GeoPoint = admin.firestore.GeoPoint;

exports.getGeoLocation = async (address) => {
  const apiToken = functions.config().google_cloud_platform.key

  const params = {
    address: address.split(' ').join('+'),
    key: apiToken
  }

  const getQueryParams = Object.entries(params).map(([k, v]) => k + '=' + v).join('&')

  const url = 'https://maps.googleapis.com/maps/api/geocode/json?' + getQueryParams

  const response = await request({
    url: url,
    json: true,
  });

  const location = response.results[0].geometry.location;
  const lat = parseFloat(location.lat);
  const lng = parseFloat(location.lng);
  return new GeoPoint(lat, lng);
}
