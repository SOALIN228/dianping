import React, { Component } from 'react'
import LikeItem from '../LikeItem'
import Loading from '../../../../components/Loading'
import './style.css'

class LikeList extends Component {
  constructor (props) {
    super(props)
    this.myRef = React.createRef()
    this.removeListener = false
  }

  render () {
    const { data, pageCount } = this.props
    return (
      <div ref={this.myRef} className="likeList">
        <div className="likeList__header">猜你喜欢</div>
        <div className="likeList__list">
          {
            data.map((item, index) => {
              return <LikeItem key={index} data={item}/>
            })
          }
        </div>
        {
          pageCount < 3 ? (
            <Loading/>
          ) : (
            // eslint-disable-next-line
            <a className="likeList__viewAll">
              查看更多
            </a>
          )
        }
      </div>
    )
  }

  componentDidMount () {
    // 缓存未加载三页
    if (this.props.pageCount < 3) {
      document.addEventListener('scroll', this.handleScroll)
    } else {
      this.removeListener = true
    }

    // 第一次显示时
    if (this.props.pageCount === 0) {
      this.props.fetchData()
    }
  }

  componentDidUpdate () {
    if (this.props.pageCount >= 3 && !this.removeListener) {
      document.removeEventListener('scroll', this.handleScroll)
      this.removeListener = true
    }
  }

  componentWillUnmount () {
    if (!this.removeListener) {
      document.removeEventListener('scroll', this.handleScroll)
    }
  }

  handleScroll = () => {
    // 页面滚动距离
    const scrollTop = document.documentElement.scrollTop
      || document.body.scrollTop
    // 屏幕可视区域高度
    const screenHeight = document.documentElement.clientHeight
    // likeList模块距离屏幕顶部高度
    const likeListTop = this.myRef.current.offsetTop
    // likeList模块高度
    const likeListHeight = this.myRef.current.offsetHeight
    // 滚动距离大于等于页面超出部分高度=>滚动到底
    if (scrollTop >= likeListHeight + likeListTop - screenHeight) {
      this.props.fetchData()
    }
  }
}

export default LikeList
