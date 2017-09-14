import React from 'react';
import Animation from 'lottie-react-native';

export default class IconAnimation extends React.Component {
  sources = [require("../resources/animations/Arrow.json"), require("../resources/animations/murally.json"), require("../resources/animations/Heart.json")]
  componentDidUpdate() {
    if(this.props.play){
      this.animation.play();
      this.props.play = false;
    }  
  }

  render() {
    return (
      <Animation
        ref={animation => { this.animation = animation; }}
        style={{
          width: this.props.width,
          height: this.props.height,
        }}
        source={  this.sources[this.props.path]  }
      />
    );
  }
}