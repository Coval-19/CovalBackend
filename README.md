# CovalBackend
Firebase cloud functions and firestore rules.

## Firestore
### Structure
```
/businesses
  /{businessId}
    name
    decription
    address
    addressCoordinates    # Updated by setGeoLocation
    /notifications
      /{notificationId}   # Created by createNotification
        timestamp
        requestId
        userId
        userName
        socialNumber
        isUserCoronaFree  # Retrived from external DB
    /requests
      /{requestId}        # Created by the user app
        userId
/users
  /{userId}
    name
    socialNumber
    /responses
      /{responseId}
        timestamp
        requestId
        businessId
        businessName
        businessAddress
        isApproved
```

## Action Flows
### 

## Functions
### setGeoLocationOnCreate
On creation of a business, set the geo location based on the address
Adds `businesses/{businessId}/addressCoordinates` baseed on `businesses/{businessId}/address`

### setGeoLocationOnUpdate
On update of a business, set the geo location based on the address only if it changed.
Adds `businesses/{businessId}/addressCoordinates` baseed on `businesses/{businessId}/address`

### newRequest
Sends a motification to a business after a user has requested entrance.

## Setup
### Upload Functions
```
firebase deploy --only functions
```

### Geocoding API Functions Setup
Updates the address coordinates to a newly created business

Requires an API key from Geocoding API  
Set API key with:  
```
firebase functions:config:set google_cloud_platform.key=<API_KEY>
```
