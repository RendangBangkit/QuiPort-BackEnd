# quiport-backend

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

Quick Report Apps bakcend implementation using Express.js.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them to your local machine.

1. NPM (Node Package Manager).
2. Adjust the Credential Key to yours (Firebase and Reverse Geolocation) .

### Installing

A step by step series of examples that tell you how to get a development env running.

Say what the step will be

```
npm install
```

End with an example of getting some data out of the system or using it for a little demo.

## Usage <a name = "usage"></a>

Create Report :
```
POST {{host}}/api/report
```
Body Request <i>form-data</i> :
- userId (TEXT)
- email
- latitude
- longitude
- image 
- otherInfo (Optional)

Get All Report :
```
GET {{host}}/api/report
```
Get Report By Id :
```
GET {{host}}/api/report/:docId
```
Params :
- docId (Document ID latest create data)

And Other API Request - Update and Delete Report

You can use your localhost or this host (http://quiport.et.r.appspot.com) - <u>s DELETE SOON </u>