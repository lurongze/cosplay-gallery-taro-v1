import Taro from '@tarojs/taro'
import {View, Text, Image, Button} from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import withLogin from '../../hoc/withLogin'
import './index.scss'
import helper from "../../utils/helper";

@inject('detailStore', 'commonStore', 'commentStore')
@observer
@withLogin()
class Detail extends Taro.Component {

  config = {
    navigationBarTitleText: '详情'
  }

  state = {
    currentShowNum: 1 // 一开始最多显示5张
  }

  componentWillMount () { }

  componentWillReact () { }

  componentDidMount () {
    const { detailStore } = this.props;
    detailStore.getDetail(this.$router.params.id)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom () {
  }


  doLike = () => {
    const { commonStore: store, detailStore: { detailData } } = this.props
    store.doLike(detailData)
  }

  moreAction = () => {
    Taro.showActionSheet({
      itemList: ['收藏', '点赞'],
      success(res) {
        console.log('res', res)
        Taro.showToast({
          title: '功能开发中...',
          icon: 'none'
        })
      }
    })
  }

  showMoreList = () => {
    const { currentShowNum } = this.state
    this.setState({
      currentShowNum: parseInt(currentShowNum) + 5
    })
  }

  onShareAppMessage() {
    const { detailStore: { detailData } } = this.props
    return {
      title: '微图分享',
      path: `/pages/detail/index?id=${detailData.id}`
    }
  }


  render () {
    const { detailStore: { detailData }, commonStore: { defaultAvatar } } = this.props
    const list = detailData.covers ? detailData.covers.split(',') : []

    const { currentShowNum } = this.state

    return (
      <View className='index'>
        <View className='header'>
          <View className='avatar' style={{backgroundImage: `url(https://icon-1253286615.cos.ap-guangzhou.myqcloud.com/avatar-cg.png)`}} />
          <View className='info'>
            <View className='name'>
              #{detailData.category}#
            </View>
            <View className='info-bottom'>
              <View className='time'>{helper.formatTime(detailData.publishTime, 'Y-M-D h:m')}</View>
            </View>
          </View>
        </View>
        <View className='desc'>
          {detailData.title}
        </View>
        <View className='picture-list'>
          {
            list.map((item, index) => {
              return index <= currentShowNum && (
                <Image className='image-item' key={index} src={item} mode='widthFix' />
              )
            })
          }
        </View>
        {
          list.length >= currentShowNum && (
            <View className='showMore' onClick={this.showMoreList}>
              + 显示更多
            </View>
          )
        }
        {
          list.length < currentShowNum && (
            <View className='loading'>
              -- 我是有底线的 --
            </View>
          )
        }

        <View className='action-list'>
          <View className='action-item van-icon van-icon-more' onClick={this.moreAction} />
          <View className='action-item van-icon van-icon-share'>
            <Button openType='share' className='share-opacity' />
          </View>
        </View>
      </View>
    )
  }
}

export default Detail
