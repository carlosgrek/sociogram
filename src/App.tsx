import {useState} from "react";
import {FamilyGram} from "./components/FamilyGram.tsx";
import {FriendGram} from "./components/FriendGram.tsx";

const App = () => {
    const [currentSociogram, setCurrentSociogram] = useState<number>(1);

    const switchSociogram = () => {
        setCurrentSociogram(currentSociogram === 1 ? 2 : 1);
    };

    return (
        <div style={{textAlign: "center", marginTop: "2rem"}}>
            <h1>Sociograms</h1>

            <button onClick={switchSociogram}>
                Go to {currentSociogram === 1 ? "Friends Sociogram" : "Family Sociogram"}
            </button>

            <div style={{marginTop: "2rem"}}>
                {currentSociogram === 1 ? <FamilyGram/> : <FriendGram/>}
            </div>
        </div>
    );
};

export default App;
