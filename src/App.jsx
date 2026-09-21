import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfiguration";

import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const imageRef = doc(db, "maps", "current");

    const unsubscribe = onSnapshot(imageRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("Document not found");
        return;
      }

      const data = snapshot.data();

      setImage(
        `data:image/${data.format};base64,${data.imageBase64}`
      );

      setInfo(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      {image ? (
        <img
          src={image}
          alt="Map"
          className="map"
        />
      ) : (
        <p>Loading image...</p>
      )}

      {info && (
        <div className="info">
          <div>{info.fileName}</div>
          <div>
            Last Update:{" "}
            {info.timestamp?.toDate?.().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
