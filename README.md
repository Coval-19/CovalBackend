# CovalBackend
Firebase cloud functions and firestore rules.

## Firestore
### Structure
```
/businesses
  /{businessId}
    name
    address
    addressCoordinates    # Updated by setGeoLocation
    /notifications
      /{notificationId}   # Created by createNotification
        timestamp
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
```

## Functions
### setGeoLocation Function
Updates the address coordinates to a newly created business

Requires an API key from Geocoding API  
Set API key with:  
`firebase functions:config:set google_cloud_platform.key=<API_KEY>`
