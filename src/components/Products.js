import React, { Component } from 'react';
import {productStyle} from '../css/product';
import { getProductInfo, addProductToCart, changeProductBuyNum, getCartInfo } from '../api/home';

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }
    
    
    componentDidMount() {
        getProductInfo({ids: this.props.data}).then(r=>{
            this.setState({products: r.data})
        })
    }
    
    checkInCart = (e,p) => {
        e.stopPropagation();
        let products = this.props.productsInCart;
        if (products.length) {
            let isInCart = false;
            let inCartProduct = {};
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                if (product['product_stock_id'] === p['product_stock_id']) {
                    isInCart = true;
                    inCartProduct = product;
                    break
                } else {
                    isInCart = false
                }
            }
            if (isInCart) {
                this.changeBuyNum(inCartProduct.id, inCartProduct['buy_num'] + 1)
            } else {
                this.addToCart(p['product_stock_id'], 1)
            }
        } else {
            this.addToCart(p['product_stock_id'], 1)
        }
    };
    
    addToCart = (id, num) => {
        addProductToCart({product_stock_id: id,buy_num: 1, token: this.props.token}).then(r=>{
            this.props.refresh(this.props.token);
        })
    };
    changeBuyNum = (id, num) => {
        changeProductBuyNum({buy_num: num, token: this.props.token}, id).then(r=>{
            this.props.refresh(this.props.token);
        })
    };
    
    productDetail = (product) => {
        window.wx.miniProgram.navigateTo({
            url: `/pages/user/goodDetail/main?type=mall&good_id=${product['product_id']}&price=${product['act_price']}`,
        })
    };
    
    render() {
        let {products} = this.state;
        return (
            <div>
                <ul style={productStyle.productsStyle}>
                    {products.length && products.map((product, index) => (
                        <li  style={productStyle.liStyle} key={index} onClick={()=>this.productDetail(product)}>
                            <img style={productStyle.imageStyle}  src={product['product_stock']['product_entity'].image} alt="" />
                            <div style={productStyle.productStyle}>
                                <h3 style={productStyle.h3Style}>{product['product_stock']['product_entity'].name}</h3>
                                <span style={productStyle.descStyle}>净含量:384g</span>
                                <span style={productStyle.descStyle}>销量:{product['product_stock']['product_entity']['total_sales']}</span>
                                {(product['tags'] && product['tags'].length) ? <em style={productStyle.tagStyle}>{product['tags'][0]}</em> : '' }
                                <div style={productStyle.priceStyle}>
                                    <div style={productStyle.leftStyle}>
                                        <i style={productStyle.iStyle}>￥</i>
                                        <h4 style={productStyle.h4Style}>{product['act_price']}</h4>
                                        <span style={productStyle.spanStyle}>￥{product['product_stock']['product_entity']['retail_price']}</span>
                                    </div>
                                    <img style={productStyle.imgStyle} onClick={(e)=>this.checkInCart(e,product)} src="./activity_images/add.png" alt="" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Products;
