import firebase from 'firebase';
import 'firebase/auth'

export class Fire {
    
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    firebaseConfig = {
        apiKey: "AIzaSyDjoSylllnX6Rvb0FkEVNg1YOpivoKlqUg",
        authDomain: "cokut-7f8c4.firebaseapp.com",
        databaseURL: "https://cokut-7f8c4.firebaseio.com",
        projectId: "cokut-7f8c4",
        storageBucket: "cokut-7f8c4.appspot.com",
        messagingSenderId: "905043672025",
        appId: "1:905043672025:web:1714a615317cb8cab0f7c8",
        measurementId: "G-LHPQFR09F3"
    };

    auth = firebase.auth()

    constructor() {
        firebase.initializeApp(this.firebaseConfig)
    }

    async loginWithEmailAndPassword() {
    }

    registerAuthChangeCallback(callback: (user: firebase.User | null) => any) {
        this.auth.onAuthStateChanged(u => {
            callback(u);
        })
    }

}