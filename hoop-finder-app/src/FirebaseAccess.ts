import firebase from 'firebase';
import { Hoop, HoopContainer } from './App';

export interface User {
    displayName: string|null|undefined,
    email: string|null|undefined,
    timeCreated: number
} 

export class FirebaseAccess{
    user : User| null = null;
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

    loginWithPopup(setUser:Function){
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
      
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = (credential as firebase.auth.OAuthCredential)?.accessToken;
          // The signed-in user info.
          var user = result.user;
          setUser({displayName: user?.displayName, email: user?.email, timeCreated: new Date().getTime()});
          
          // ...
        }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          
        });
        return this.user;
      }

    setEventHandlers(setLocations: Function){
        let hoopsRef = firebase.database().ref("hoops");
        hoopsRef.on('child_added', (data) => {
            setLocations((oldarray:HoopContainer[]) => [...oldarray, {ref: data.key, hoop: data.val()}]);
        })

        hoopsRef.on('child_removed', (data) =>{
            setLocations((oldarray:HoopContainer[]) => {
                let prevHoops = [...oldarray];
                
                let newHoops = prevHoops.filter(item => (item.hoop.lat != data.val().lat && item.hoop.lng != data.val().lng));
                return newHoops;
            })
        })
    }

    public static getInstance(){
        if(this.instance == null){
            this.instance = new FirebaseAccess();
        }
        return this.instance;
    }

    initFirebase(){
        // Initialize Firebase
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

    deleteHoop(hoop:HoopContainer, callback:Function){
        FirebaseAccess.getInstance().getDatabase().ref("hoops").child(hoop.ref).remove();
        callback();
    }


}
