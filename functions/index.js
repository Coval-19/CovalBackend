const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {getGeoLocation} = require('./geocodingApi')

admin.initializeApp(functions.config().firebase)

exports.setGeoLocation = functions.firestore
  .document('businesses/{businessId}')
  .onCreate(async (doc) => {
    try {
      const location = await getGeoLocation(doc.get('address'));
      return doc.ref.set({
        addressCoordinates: location
      }, { merge: true });
    }
    catch (error) {
      console.log(error);
    }
  })

const createNotification = (businessId, notification) => {
  return admin.firestore()
    .collection('businesses')
    .doc(businessId)
    .collection('notifications')
    .add(notification)
    .then(doc => console.log("notification created", doc))
}

exports.newRequest = functions.firestore
  .document('businesses/{businessId}/requests/{requestId}')
  .onCreate((doc, context) => {
    const businessId = context.params.businessId
    const userId = doc.get('userId')

    return admin.firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        const notification = {
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          userId: userId,
          userName: doc.get('name'),
          socialNumber: doc.get('socialNumber'),
          isUserCoronaFree: true, // TODO: We need to get this information from the database after we link to it
        }
        return createNotification(businessId, notification)
      })
  })
  