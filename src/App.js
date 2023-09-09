import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import "./App.css";


const initialState = {
    input: "",
    imgUrl: "",
    box: {},
    route: "signin",
    isSignedIn: false,
    user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
    },
};

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined,
            },
        });
    };

    calculateFaceLocation = (dataObj) => {
        const calrifaiFace =
            dataObj.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("input-image");
        const width = Number(image.width);
        const height = Number(image.height);

        return {
            leftCol: calrifaiFace.left_col * width,
            topRow: calrifaiFace.top_row * height,
            rightCol: width - calrifaiFace.right_col * width,
            bottomRow: height - calrifaiFace.bottom_row * height,
        };
    };

    displayFaceBox = (box) => {
        this.setState({ box: box });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onPictureSubmit = () => {
        this.setState({ imgUrl: this.state.input });

        fetch("http://localhost:3001/imageurl", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: this.state.input,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result) {
                    fetch("http://localhost:3001/image", {
                        method: "put",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: this.state.user.id,
                        }),
                    })
                        .then((res) => res.json())
                        .then((count) => {
                            this.setState(
                                Object.assign(this.state.user, {
                                    entries: count,
                                })
                            );
                        })
                        .catch(console.log);
                }
                this.displayFaceBox(this.calculateFaceLocation(result));
            })
            .catch((error) => console.log("error", error));
    };

    onRouteChange = (route) => {
        if (route === "signout") {
            this.setState(initialState);
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    render() {
        const { isSignedIn, imgUrl, route, box } = this.state;
        return (
            <div className="App">
                <ParticlesBg
                    className="particles"
                    num={250}
                    color="#45B8AC"
                    type="cobweb"
                    bg={true}
                />
                <Navigation
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                {route === "home" ? (
                    <div>
                        <Logo />
                        <Rank
                            name={this.state.user.name}
                            entries={this.state.user.entries}
                        />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onPictureSubmit={this.onPictureSubmit}
                        />

                        <FaceRecognition box={box} imgUrl={imgUrl} />
                    </div>
                ) : route === "signin" ? (
                    <SignIn
                        onRouteChange={this.onRouteChange}
                        loadUser={this.loadUser}
                    />
                ) : (
                    <Register
                        loadUser={this.loadUser}
                        onRouteChange={this.onRouteChange}
                    />
                )}
            </div>
        );
    }
}

export default App;
