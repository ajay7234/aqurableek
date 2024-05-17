var admin = require("firebase-admin");

var serviceAccount = require("../json/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bj3d-56ec0-default-rtdb.firebaseio.com",
});
