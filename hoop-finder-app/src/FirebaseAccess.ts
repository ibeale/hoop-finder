import firebase from 'firebase';
import { Hoop, HoopContainer } from './App';



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
