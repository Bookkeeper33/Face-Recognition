import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ box, imgUrl }) => {
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img
                    id="input-image"
                    src={imgUrl}
                    alt="face"
                    width="500px"
                    height="auto"
                    style={!imgUrl ? { display: "none" } : { display: "block" }}
                ></img>
                <div
                    className="bounding-box"
                    style={{
                        top: box.topRow,
                        right: box.rightCol,
                        bottom: box.bottomRow,
                        left: box.leftCol,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default FaceRecognition;
