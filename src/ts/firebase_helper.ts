import router from '@/router';
import firebase from 'firebase/app';
import 'firebase/auth'
// import 'firebase/app'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjoSylllnX6Rvb0FkEVNg1YOpivoKlqUg",
    authDomain: "cokut-7f8c4.firebaseapp.com",
    databaseURL: "https://cokut-7f8c4.firebaseio.com",
    projectId: "cokut-7f8c4",
    storageBucket: "cokut-7f8c4.appspot.com",
    messagingSenderId: "905043672025",
    appId: "1:905043672025:web:1714a615317cb8cab0f7c8",
    measurementId: "G-LHPQFR09F3"
};
firebase.initializeApp(firebaseConfig)

export class Fire {



    auth = firebase.auth()
    sessionPersistence=     firebase.auth.Auth.Persistence.SESSION


    async loginWithEmailAndPassword(email: string, password: string): Promise<string> {

        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password)
            router.push({path:'/'})
            return ""
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                return "Wrong password email combination"
            }
            else {
                return "An error occured please try again"
            }
        }


    }

    async getToken(): Promise<string|undefined>{
        return this.auth.currentUser?.getIdToken()
    }



}

export const fire = new Fire()
fire.auth.setPersistence(fire.sessionPersistence)


