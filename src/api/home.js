import request from '../utils/request'

export function getActInfo(params,id, env) {
	return request(env)({
		url: `/api/mp/activities/${id}`,
		method: 'get',
		params: params
	})
}

// 根据id 获取商品详情信息
export function getProductInfo(params, env) {
	return request(env)({
		url: `/api/mp/activity/products`,
		method: 'get',
		params: params
	})
}

// 获取当前购物车
export function getCartInfo(params,env) {
	return request(env)({
		url: 'api/mp/mall/carts',
		method: 'get',
		params: params
	})
}

// 添加商品进购物车let response = await this.httpPost('api/mp/mall/carts', {
//             product_stock_id: id,
//             buy_num: num
//         });
export function addProductToCart(params, env) {
	return request(env)({
		url: 'api/mp/mall/carts',
		method: 'post',
		data: params
	})
}

// 修改购物车商品数量
export function changeProductBuyNum(params,cart, env) {
	return request(env)({
		url: `api/mp/mall/carts/${cart}`,
		method: 'put',
		data: params
	})
}
