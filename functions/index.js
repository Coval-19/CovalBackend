const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

const createUserEntranceRequestNotification = async (userEntranceRequestNotification, businessId) => {
  const doc = await admin.firestore().collection('?')
    .add(userEntranceRequestNotification);
  return console.log(doc);
}

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
