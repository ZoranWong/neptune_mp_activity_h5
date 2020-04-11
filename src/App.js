import './App.css';
import React, { Component } from 'react';
import {getActInfo, getCartInfo} from './api/home';
import ShareButton from './components/ShareButton';
import Products from './components/Products';
// import CustomHeader from './components/CustomHeader';

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
            statusHeight: 0,
            env: 'dev',
            isShowBottom: false
        };
    }



    componentDidMount() {
        let params = this.getQueryVariable('activity_id');
        let token = this.getQueryVariable('token');
        let statusHeight = this.getQueryVariable('headHeight');
        let mainHeight = this.getQueryVariable('mainHeight');
        let env = this.getQueryVariable('env', 'dev');
        this.setState({actId: params,token,statusHeight,mainHeight,env}, ()=>{
            this.refresh(token);
        });
        getActInfo({}, params, env).then(r=>{
            this.setState({data: r.data, templates: r.data.template, title: r.data.name})
        }).catch(_=>{});
        window.addEventListener('scroll', this.bindScroll)
    
    }
    
    refresh = (token) => {
        getCartInfo({token}, this.state.env).then(r=>{
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
    
    getQueryVariable = (variable, defaultValue) => {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return defaultValue;
    };
    
    renderTemplate = (template) => {
        let props = {
            data: template.data,
            key: template.name,
            token: this.state.token,
            productsInCart: this.state.productsInCart,
            refresh: this.refresh,
            env: this.state.env
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
        window.wx.miniProgram.postMessage({data: 'xxxxxxxx'});
        window.wx.miniProgram.navigateBack({});
        window.removeEventListener('scroll', this.bindScroll);
    }
    
    bindScroll = (event) => {
        // const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false) || window.pageYOffset || (event.srcElement ? event.srcElement.body.scrollTop : 0);
        // // 视窗高度
        // const clientHeight = (event.srcElement && event.srcElement.documentElement.clientHeight) || document.body.clientHeight;
        // // 页面高度
        // const scrollHeight = (event.srcElement && event.srcElement.documentElement.scrollHeight) || document.body.scrollHeight;
        // // 距离页面底部的高度
        // const height = scrollHeight - scrollTop - clientHeight;
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //滚动条滚动距离
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        //窗口可视范围高度
        let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);
    
        // 判断距离页面底部的高度
        if (clientHeight + scrollTop >= scrollHeight) {
            // 判断执行回调条件
            console.log('<0');
            this.setState({isShowBottom: true})
        } else {
            console.log('>0');
            this.setState({isShowBottom: false})
        }
    };
    
    
    
    
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
                <div >
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
                    {
                        this.state.isShowBottom ? <div className='bottomLine' style={bottomStyle}>- 我是有底线的 -</div> : ''
                    }
                </div>
            </div>
        );
    }
}

export default App;
