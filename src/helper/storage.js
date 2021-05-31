/* eslint-disable max-len */
/* eslint-disable prefer-promise-reject-errors */
const util = require('util');
const firebase = require('../config');

const storage = firebase.storage().bucket();

/**
 *
 * @param { File } object file object that will be uploaded
 * @param { Emaill } string an email for identify the author metadata
 * @param { identity } date a data for create a unique image name
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file, email, identity, uid) => new Promise((resolve, reject) => {
  const { originalname, buffer, mimetype } = file;
  const blob = storage.file(identity + originalname.replace(/ /g, '_'));
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uid,
      author: email,
    },
    contentType: mimetype,
  };

  const blobStream = blob.createWriteStream({
    metadata,
    resumable: false,
  });

  blobStream.on('finish', () => {
    const publicUrl = util.format(
      `https://storage.googleapis.com/${storage.name}/${blob.name}`,
    );
    resolve(publicUrl);
  })
    .on('error', () => {
      reject('Unable to upload image, something went wrong');
    })
    .end(buffer);
});

const deleteImage = (file) => {
  const splitfile = file.split('/');
  const filename = splitfile[splitfile.length - 1];

  storage.file(filename).delete().then((data) => {
    const apiResponse = data[0];
    return apiResponse;
  });
};

module.exports = { uploadImage, deleteImage };
