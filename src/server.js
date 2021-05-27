/* eslint-disable consistent-return */
/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const firebase = require('./config');

const upload = require('./helper/file');
const { uploadImage, deleteImage } = require('./helper/storage');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = firebase.firestore();

// Routes
app.get('/', (req, res) => res.status(200).send('Welcome!'));

// create POST
app.post('/api/report', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.body;
    const { email } = req.body;
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const otherInfo = req.body.otherInfo || '-';
    const myFile = req.file;
    const createdAt = Date.now();
    const updatedAt = createdAt;

    const imageUrl = await uploadImage(myFile, email, createdAt);

    request({
      uri: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAP_API_KEY}`,
      json: true,
    }, async (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const result = body.results[0];
        const address = result.formatted_address;
        const city = result.address_components[4].long_name;
        const province = result.address_components[5].long_name;
        const country = result.address_components[6].long_name;

        const postData = {
          userId,
          email,
          address_components: {
            address,
            city,
            province,
            country,
            latitude,
            longitude,
          },
          imageUrl,
          otherInfo,
          createdAt,
          updatedAt,
        };

        await db.collection('reports').add(postData).then((docRef) => res.status(201).send({
          status: res.statusCode,
          message: 'Report Created',
          idReport: docRef.id,
        }));
      }
    });
  } catch (error) {
    console.error('Error Creating Report: ', error);
    return res.status(500).send({
      status: res.statusCode,
      message: 'Error Creating Report: ',
      error,
    });
  }
});

// GET
app.get('/api/report', async (req, res) => {
  try {
    const query = db.collection('reports');
    const response = [];

    await query.get().then(((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        response.push({
          reportId: doc.id,
          ...doc.data(),
        });
      });
    }));
    return res.status(200).send({
      status: res.statusCode,
      message: 'Getting All Data Success',
      data: response,
    });
  } catch (error) {
    console.error('Error Getting All Report: ', error);
    return res.status(500).send();
  }
});

app.get('/api/report/:docId', async (req, res) => {
  try {
    const document = db.collection('reports').doc(req.params.docId);
    const report = await document.get();
    const response = report.data();

    if (response === undefined) {
      return res.status(500).send({
        status: 'Failed',
        message: 'Error Getting Data',
      });
    }

    return res.status(200).send({
      status: res.statusCode,
      message: 'Getting Data Success',
      data: response,
    });
  } catch (error) {
    console.error('Error Getting Report: ', error);
    return res.status(500).send();
  }
});

// PUT
app.put('/api/report/:docId', upload.single('image'), async (req, res) => {
  try {
    const document = db.collection('reports').doc(req.params.docId);
    const report = await document.get();
    const response = report.data();

    const { email } = response;
    const { createdAt } = response;
    const otherInfo = req.body.otherInfo || 'nothing';
    const myFile = req.file;
    const updatedAt = Date.now();

    const imageUrl = await uploadImage(myFile, email, createdAt);

    const putData = {
      imageUrl,
      otherInfo,
      updatedAt,
    };

    await document.update(putData).then(() => res.status(201).send({
      status: res.statusCode,
      message: 'Report Updated',
      idReport: document.id,
      updatedAt: new Date(updatedAt).toLocaleString(),
    }));
  } catch (error) {
    console.error('Error Updating Report: ', error);
    return res.status(500).send();
  }
});

// DELETE
app.delete('/api/report/:docId', async (req, res) => {
  try {
    const document = db.collection('reports').doc(req.params.docId);
    const report = await document.get();
    const response = report.data();

    const deletedImage = deleteImage(response.imageUrl);

    await document.delete().then(() => res.status(200).send({
      status: res.statusCode,
      message: 'Delete Success',
      idReport: document.id,
      image: deletedImage,
    }));
  } catch (error) {
    console.error('Error Deleting Report: ', error);
    return res.status(500).send();
  }
});

const PORT = process.env.PORT || process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
