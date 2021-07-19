'use strict';

const qrcode = require('qrcode')
const os = require('os')
const fs = require('fs')
const path = require('path')
const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp();

exports.qrcodify = functions.handler.firestore.document.onWrite(async (change) => {
    console.log('Running qrcodify for change...');
    const qrCodeSourceField = process.env.QR_CODE_SOURCE_FIELD;
    const qrCodeUrlField = process.env.QR_CODE_URL_FIELD;
    if (qrCodeSourceField == qrCodeUrlField) {
        console.log('QR Codify: input field cannot be the same as output field. Please reconfigure your extension.');
        return;
    }
    const before = change.before.get(qrCodeSourceField);
    const after = change.after.get(qrCodeSourceField);
    // There was no change so no new QR code needed.
    if (before === after && before !== 'undefined' && after !== 'undefined') {
        return;
    }
    console.log('Generating new QR code image for URL: ', after);
    const fileName = 'qr_code_' + change.after.id + '.png';
    const tempLocalFilePath = path.join(os.tmpdir(), path.basename(fileName));
    // Generate and write the QR code image to local storage.
    await qrcode.toFile(tempLocalFilePath, after).then(async () => {
        const storageBucket = admin.storage().bucket(process.env.STORAGE_BUCKET);
        // Upload QR code image to Firebase Storage.
        return storageBucket.upload(tempLocalFilePath).then(async (uploadResponse) => {
            const fileUrl = uploadResponse[0].publicUrl();
            console.log('Generated a new QR code image located at: ' + fileUrl);
            // Delete the QR code image from local storage.
            fs.unlinkSync(tempLocalFilePath);
            console.log('Deleted generated QR code image from local storage.');
            // Set the URL to the new QR code image in the Cloud Firebase collection.
            await admin.firestore().runTransaction((transaction) => {
                transaction.update(change.after.ref, qrCodeUrlField, fileUrl);
                return Promise.resolve();
            });
        }).catch((error) => {
            console.log('There was an error uploading the QR code to Firebase Storage: ' + error);
        });
    }).catch((error) => {
        console.log('There was an error generating the QR code: ' + error);
    });
});