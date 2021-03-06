import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import PurchaseForm from './components/PurchaseForm'
import Tip from '../../components/Tip'
import {
  actions as purchaseActions,
  getProduct,
  getQuantity,
  getTipStatus,
  getTotalPrice
} from '../../redux/modules/purchase'
import { getUsername } from '../../redux/modules/login'
import { actions as detailActions } from '../../redux/modules/detail'

class Purchase extends Component {
  render () {
    const { product, phone, quantity, showTip, totalPrice } = this.props
    return (
      <div>
        <Header title="下单" onBack={this.handleBack}/>
        {
          product
            ? <PurchaseForm phone={phone}
                            quantity={quantity}
                            totalPrice={totalPrice}
                            onSubmit={this.handleSubmit}
                            onSetQuantity={this.handleSetQuantity}/>
            : null
        }
        {showTip ? <Tip message="购买成功！" onClose={this.handleCloseTip}/> : null}
      </div>
    )
  }

  componentDidMount () {
    const { product } = this.props
    // 商品数据未被加载
    if (!product) {
      const productId = this.props.match.params.id
      this.props.detailActions.loadProductDetail(productId)
    }
  }

  componentWillUnmount () {
    this.props.purchaseActions.setOrderQuantity(1)
  }

  handleBack = () => {
    this.props.history.goBack()
  }

  handleSubmit = () => {
    const productId = this.props.match.params.id
    this.props.purchaseActions.submitOrder(productId)
  }

  handleSetQuantity = quantity => {
    this.props.purchaseActions.setOrderQuantity(quantity)
  }

  handleCloseTip = () => {
    this.props.purchaseActions.closeTip()
  }
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id
  return {
    product: getProduct(state, productId),
    quantity: getQuantity(state),
    showTip: getTipStatus(state),
    phone: getUsername(state),
    totalPrice: getTotalPrice(state, productId)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    purchaseActions: bindActionCreators(purchaseActions, dispatch),
    detailActions: bindActionCreators(detailActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchase)
