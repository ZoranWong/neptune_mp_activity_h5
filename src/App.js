import './App.css';
import React, { Component } from 'react';
import {getActInfo, getCartInfo} from './api/home';
import ShareButton from './components/ShareButton';
import Products from './components/Products';
import CustomHeader from './components/CustomHeader';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actId: [],
            data: {},
            templates: [],
            title: '',
            productsInCart: [],
            token: '',
            statusHeight: 0
        };
    }



    componentDidMount() {
        let params = this.getQueryVariable('activity_id');
        let token = this.getQueryVariable('token');
        let statusHeight = this.getQueryVariable('headHeight');
        let mainHeight = this.getQueryVariable('mainHeight');
        this.setState({actId: params,token,statusHeight,mainHeight}, ()=>{
            this.refresh(token);
        });
        getActInfo({}, params).then(r=>{
            this.setState({data: r.data, templates: r.data.template, title: r.data.name})
        }).catch(_=>{});
    }
    
    refresh = (token) => {
        getCartInfo({token}).then(r=>{
            this.setState({productsInCart: r.data})
        }).catch(_=>{})
    };
    
    caculateCartQuantity = () => {
        let quantity = 0;
        let products = this.state.productsInCart;
        for (let i = 0; i < products.length; i++ ) {
            quantity += Number(products[i]['buy_num'])
        }
        return quantity
    };
    
    getQueryVariable = (variable) => {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    };
    
    renderTemplate = (template) => {
        let props = {
            data: template.data,
            key: template.name,
            token: this.state.token,
            productsInCart: this.state.productsInCart,
            refresh: this.refresh
        };
        switch (template.name) {
            case 'SHARE_BUTTON':
                return <ShareButton {...props} />;
            case 'PRODUCTS':
                return <Products {...props} />;
            default :
                return ''
        }
    };
    
    goShoppingCart = () => {
        window.wx.miniProgram.navigateTo({
            url: '/pages/user/ShoppingCart/main',
        })
    };
    
    componentWillUnmount() {
        window.wx.miniProgram.postMessage({data: 'xxxxxxxx'})
    }
    
    render() {
        const {templates,title} = this.state;
        const imgStyle = {
            position: 'fixed',
            left: '20px',
            bottom: '125px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(17,17,17,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
        const bottomStyle = {
            width: '100%',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f4f1f4',
            fontSize: '11px',
            color: '#b3b3b3'
        };
        const cartLengthStyle = {
            position: 'absolute',
            top: '4px',
            right: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '100%',
            background: '#FE3B32',
            color: '#fff',
            border: '1px solid #fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <div className="App" style={{position: 'relative'}}>
                {/*<CustomHeader title={title} height={this.state.statusHeight} />*/}
                <div style={{height: this.state.mainHeight + 'px', overflow: 'auto'}}>
                    {
                        templates.map(template => {
                            return this.renderTemplate(template)
                        })
                    }
                    <div style={imgStyle} onClick={this.goShoppingCart}>
                        <img src="./activity_images/white_cart.png" style={{width: '24px', height: '24px'}} alt=""/>
                        {
                            this.state.productsInCart.length ? <span style={cartLengthStyle} >
                            {this.caculateCartQuantity()}
                        </span>: ''
                        }
                    </div>
                    <div style={bottomStyle}>- 我是有底线的 -</div>
                </div>
            </div>
        );
    }
}

export default App;
