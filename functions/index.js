const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {getGeoLocation} = require('./geocodingApi')
const {isUserCoronaFree} = require('./coronaIsolationApi')

admin.initializeApp(functions.config().firebase)

exports.setGeoLocationOnCreate = functions.firestore
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

exports.setGeoLocationOnUpdate = functions.firestore
  .document('businesses/{businessId}')
  .onUpdate(async (doc) => {
    if (doc.before.get('address') === doc.after.get('address')) {
      return null
    }

    try {
      const location = await getGeoLocation(doc.after.get('address'));
      return doc.after.ref.set({
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
    const requestId = context.params.requestId
    const userId = doc.get('userId')

    return admin.firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        const notification = {
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          requestId: requestId,
          userId: userId,
          userName: doc.get('name'),
          socialNumber: doc.get('socialNumber'),
          isUserCoronaFree: isUserCoronaFree(userId),
        }
        return createNotification(businessId, notification)
      })
  })
  