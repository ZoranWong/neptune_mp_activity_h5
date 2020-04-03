import React, { Component } from 'react';

class CustomHeader extends Component {
    componentDidMount () {
        console.log(this.props);
    }
    
    render() {
        return (
            <div style={{width: '100%', height: this.props.height + 'rpx', display: 'flex', justifyContent: 'flex-start',alignItems: 'center', background:'#f6f6f6', padding: '0 10px', boxSizing: 'border-box'}}>
            
            </div>
        );
    }
}

export default CustomHeader;
