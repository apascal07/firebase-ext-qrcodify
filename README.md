# QR Codify

**Author**: Alex Pascal 

**Description**: Converts a Cloud Firestore collection field into a QR code image and stores its URL alongside the original.



**Details**: Use this extension to watch a specified field in a Cloud Firestore collection and then generate a QR code image for that field's value, upload it to Firebase Storage, and write its URL to the same collection.

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

You must also have a Firebase Storage instance set up.

#### Billing
 
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)
 
- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s free tier:
  - Cloud Firestore
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
  - Firebase Storage



**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Collection path: What is the path to the collection that contains the URLs that you want to encode in QR codes?


* QR Code Source Field: What is the name of the field that contains the content to be encoded in the QR code?


* QR Code URL Field: What is the name of the field where you want to store the URL to the QR code?




**Cloud Functions:**

* **qrcodify:** Listens for writes of new URLs to your specified Cloud Firestore collection, generates a QR code image, uploads it to Firebase Storage, and stores the URL to the image in the collection.



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to write QR code image URLs to Cloud Firestore)

* storage.objectAdmin (Reason: Allows the extension to write and replace QR code images to Firebase Storage)
