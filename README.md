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
/users
  /{userId}
    name
    socialNumber
/requests                 # Created by the user app
  /{businessId}
    /{requestId}
      userId
/notifications            # Created by createNotification
  /{businessId}
    /{notificationId}
      timestamp
      userId
      userProfileImage
      userName
      isUserCoronaFree    # Retrived from external DB

```

## Functions
### setGeoLocation Function
Updates the address coordinates to a newly created business

Requires an API key from Geocoding API  
Set API key with:  
`firebase functions:config:set google_cloud_platform.key=<API_KEY>`
