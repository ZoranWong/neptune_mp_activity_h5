import React, { Component } from 'react';
import {productStyle} from '../css/product';
import { getProductInfo, addProductToCart, changeProductBuyNum, getCartInfo } from '../api/home';

class RichText extends Component {
    loading = false;
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        };
    }
    
    
    componentDidMount() {
        console.log(this.props, '========>>>>>>>');
        this.setState({data: this.props.data})
    }
    
    
    
    
    render() {
        return (
            <div style={{padding: '0 10px'}}>
                {
                    this.state.data ? <div  dangerouslySetInnerHTML={{
                        __html: this.state.data
                    }}/> : ''
                }
            </div>
        );
    }
}

export default RichText;
