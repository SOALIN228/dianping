import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import ProductOverview from './components/ProductOverView'
import ShopInfo from './components/ShopInfo'
import Detail from './components/Detail'
import Remark from './components/Remark'
import BuyButton from './components/BuyButton'
import { actions as detailActions, getProduct, getRelatedShop } from '../../redux/modules/detail'

class ProductDetail extends Component {
  render () {
    const { product, relatedShop } = this.props
    return (
      <div>
        <Header title="团购详情" onBack={this.handleBack} grey/>
        {product && <ProductOverview data={product}/>}
        {relatedShop && <ShopInfo data={relatedShop} total={product.shopIds.length}/>}
        {product && (
          <div>
            <Detail data={product}/>
            <Remark data={product}/>
            <BuyButton productId={product.id}/>
          </div>
        )}
      </div>
    )
  }

  componentDidMount () {
    const { product } = this.props
    if (!product) { // 首次加载product 数据
      const productId = this.props.match.params.id
      this.props.detailActions.loadProductDetail(productId)
    } else if (!this.props.relatedShop) { // 首次加载relatedShop 数据
      this.props.detailActions.loadShopById(product.nearestShop)
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // 首次加载product 数据，需要继续加载relatedShop 数据
    if (!prevProps.product && this.props.product) {
      this.props.detailActions.loadShopById(this.props.product.nearestShop)
    }
  }

  handleBack = () => {
    this.props.history.goBack()
  }
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id
  return {
    product: getProduct(state, productId),
    relatedShop: getRelatedShop(state, productId)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    detailActions: bindActionCreators(detailActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)
