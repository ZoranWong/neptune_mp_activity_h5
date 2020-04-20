import React, { Component } from 'react';
import {productStyle} from '../css/product';
import { getProductInfo, addProductToCart, changeProductBuyNum, getCartInfo } from '../api/home';

class Products extends Component {
    loading = false;
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            productsInCart: []
        };
    }
    
    
    componentDidMount() {
        getProductInfo({ids: this.props.data}, this.props.env).then(r=>{
            this.setState({products: r.data})
        });
        this.refresh();
    }
    
    refresh = () => {
        getCartInfo({token: this.props.token}, this.props.env).then(r=>{
            this.setState({productsInCart: r.data});
            this.loading = false
        }).catch(_=>{})
    };
    
    createElement = p => {
        let ball = document.createElement('div');
        let parent = document.getElementsByClassName(`li${p.id}`)[0];
        ball.style.width="20px";
        ball.style.height="20px";
        ball.style.borderRadius="50%";
        ball.style.position="absolute";
        ball.style.left="0px";
        ball.style.top="0px";
        ball.style.backgroundColor="red";
        parent.appendChild(ball)
    };
    
    checkInCart = (e,p) => {
        console.log(e, '{}{}}');
        e.stopPropagation();
        
        //this.createElement(p);
        if (this.loading) return;
        this.loading = true;
        let products = this.state.productsInCart;
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
                this.changeBuyNum(inCartProduct.id, inCartProduct['buy_num'] + 1);
            } else {
                this.addToCart(p['product_stock_id'], 1);
            }
        } else {
            this.addToCart(p['product_stock_id'], 1);
        }
    
        
    };
    
    addToCart = (id, num) => {
        addProductToCart({product_stock_id: id,buy_num: 1, token: this.props.token}, this.props.env).then(r=>{
            this.props.refresh(this.props.token);
            this.refresh();
        })
    };
    changeBuyNum = (id, num) => {
        changeProductBuyNum({buy_num: num, token: this.props.token}, id, this.props.env).then(r=>{
            this.props.refresh(this.props.token);
            this.refresh();
        })
    };
    
    productDetail = (product) => {
        let stockInfo = this.hasStock(product) ? '尚有库存' : '暂无库存';
        window.wx.miniProgram.navigateTo({
            url: `/pages/user/goodDetail/main?type=mall&good_id=${product['product_id']}&price=${product['act_price']}&stockInfo=${stockInfo}`,
        })
    };
    
    hasStock = (product) => {
        let hasStock = true;
        if (product['has_sell_limit']) {
            hasStock = product['last_num'] > 0 && product['product_stock']['in_stock'] > 0
        } else {
            hasStock = product['product_stock']['in_stock'] > 0
        }
        return hasStock
    };
    
    handleStockNum = (product) => {
        let num = 0;
        if (product['has_sell_limit']) {
            num = product['last_num']
        } else {
            num = product['product_stock']['in_stock']
        }
        return num
    };
    
    render() {
        let {products} = this.state;
        return (
            <div>
                <ul style={productStyle.productsStyle}>
                    {products.length ? products.map((product, index) => (
                        <li className={'li' + product.id} style={index === products.length -1 ? productStyle.liStyleLastChild :productStyle.liStyle} key={index} onClick={()=>this.productDetail(product)}>
                            {
                                this.hasStock(product) ? '' : <div style={productStyle.sellOutStyle} >
                                    <span style={productStyle.sellOutContent}>已抢光</span>
                                </div>
                            }
                            <img style={productStyle.imageStyle}  src={product['product_stock']['product_entity'].image} alt="" />
                            <div style={productStyle.productStyle}>
                                <h3 style={productStyle.h3Style}>{product['product_stock']['product_entity']['display_name']}</h3>
                                <span style={productStyle.descStyle}>净含量:384g</span>
                                <div>
                                    <span style={productStyle.descStyle}>销量:{product['product_stock']['product_entity']['total_sales']}</span>
                                    <span style={productStyle.stockStyle}>优惠商品剩余{this.handleStockNum(product)}件</span>
                                </div>
                               
                                {(product['tags'] && product['tags'].length) ? <em style={productStyle.tagStyle}>{product['tags'][0]}</em> : '' }
                                <div style={productStyle.priceStyle}>
                                    <div style={productStyle.leftStyle}>
                                    <i style={productStyle.iStyle}>￥</i>
                                    <h4 style={productStyle.h4Style}>{product['act_price']}</h4>
                                    <span style={productStyle.spanStyle}>￥{product['product_stock']['product_entity']['retail_price']}</span>
                                    </div >
                                    {
                                        this.hasStock(product) ?
                                            <div style={productStyle.clickAreaStyle} onClick={(e)=>this.checkInCart(e,product)}>
                                                <img style={productStyle.imgStyle}  src="./activity_images/add.png" alt="" />
                                            </div>
                                             :
                                            <img style={productStyle.imgStyle} src="./activity_images/disabledAdd.jpg" alt="" />
                                    }
                                    
                                </div>
                            </div>
                        </li>
                    )) : '页面加载中···'}
                </ul>
            </div>
        );
    }
}

export default Products;
