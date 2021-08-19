import React, { Component } from 'react';
import './App.css';
import Particles from "react-tsparticles";
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import 'tachyons';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const particlesOptions = {

  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 4,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

class App extends Component {
  constructor () {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  calculateFaceLocation = (bounding_box) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: bounding_box.left_col * width,
      topRow: bounding_box.top_row * height,
      rightCol: width - (bounding_box.right_col * width),
      bottomRow: height - (bounding_box.bottom_row * height),
    }
  }
  loadUser = (user) => {
    this.setState({ user: user });
  }
  displayFacebox = (box) => {
    this.setState({ box: box })
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    fetch('https://sleepy-bayou-13918.herokuapp.com/image', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'input': this.state.input })
    }).then(response => response.json()).then(data => {
      console.log(data);
      this.displayFacebox(this.calculateFaceLocation(data));
      this.updateUserEntries();
    }).catch(error => console.log(error));
  }
  updateUserEntries = () => {

    fetch('https://sleepy-bayou-13918.herokuapp.com/image', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.state.user.id })
    })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count }))
      });
  }
  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    }
    this.setState({ route: route });
  }

  render() {
    return (
      <div className="App" >
        <Particles
          id="tsparticles"
          options={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {
          this.state.route === 'home' ?
            <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange} />
              <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
            </div> :
            (this.state.route === 'signin' ?
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> :
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
        }
      </div>
    )
  };
}

export default App;
