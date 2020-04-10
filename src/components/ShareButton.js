import React, { Component } from 'react';

class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: ''
        }
    }
    
    
    componentDidMount() {
        this.setState({image: this.props.data});
        let share = document.getElementById('share');
        this.props.computedHeight(share.offsetHeight);
    }
    
    render() {
        return (
            <div id='share'>
                <img src={this.state.image} alt="" mode="widthFix" style={{width: '100%', height: 'auto'}} />
            </div>
        );
    }
}

export default ShareButton;
