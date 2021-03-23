import firebase from 'firebase';
import { Hoop } from './App';



export class FirebaseAccess{
    firebaseConfig = {
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY !== undefined ? process.env.REACT_APP_GOOGLE_API_KEY : "",
        authDomain: "hoop-finder.firebaseapp.com",
        projectId: "hoop-finder",
        storageBucket: "hoop-finder.appspot.com",
        appId: "1:272721531548:web:8b628722930b490d47d359",
        databaseURL: "https://hoop-finder-database.firebaseio.com/",
    }

    static instance: FirebaseAccess | null = null

    private constructor(){
        this.initFirebase();
    }

    public static getInstance(){
        if(this.instance == null){
            this.instance = new FirebaseAccess();
        }
        return this.instance;
    }

    initFirebase(){
        // Initialize Firebase
        console.log("test");
        firebase.initializeApp(this.firebaseConfig);
        firebase.analytics();
    }

    getDatabase(){
        return firebase.database();
    }
    createHoop(hoop:Hoop) {
        let newHoopRef = FirebaseAccess.getInstance().getDatabase().ref("hoops").push()
        newHoopRef.set(hoop);
      
    }


}
