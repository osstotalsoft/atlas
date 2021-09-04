import React from 'react'
import PropTypes from 'prop-types'
import VirtualScrollChild from './VirtualScrollChild'
import InfiniteScroll from './InfiniteScroll'

const VirtualAndInfiniteScroll = ({ listItems, itemTemplate: ItemTemplate }) => {
  return (
    <InfiniteScroll
      listItems={listItems?.map((listItem, index) => (
        <VirtualScrollChild key={index} height={listItem.height}>
          <ItemTemplate id={`${listItem.type}-${index}`} item={listItem} />
        </VirtualScrollChild>
      ))}
    />
  )
}

VirtualAndInfiniteScroll.propTypes = {
  listItems: PropTypes.array,
  itemTemplate: PropTypes.func
}

export default VirtualAndInfiniteScroll
