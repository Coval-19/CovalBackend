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



exports.userEntranceRequest = functions.firestore
  .document('businesses/{businessId}/usersEntranceRequest/{userEntranceRequest}')
  .onCreate((doc, context) => {
    const businessId = context.params.businessId
    
    const userEntranceRequest = doc.data();
    const userEntranceRequestNotification = {
      userEntranceRequest: userEntranceRequest, // The structure of this field is defined in the user app
      isUserCoronaFree: false, // TODO: We need to get this information from the database after we link to it
      time: admin.firestore.FieldValue.serverTimestamp(),
    }

    return createUserEntranceRequestNotification(userEntranceRequestNotification, 4)
  }
)
