import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import TrayWidgetFilter from './TrayWidgetFilter'
import DesignerMenu from './DesignerMenu'
import { filter, includes } from 'ramda'
import { emptyString } from 'utils/constants'
import LoadingFakeText from '@bit/totalsoft_oss.react-mui.fake-text'
import VirtualAndInfiniteScroll from '../../../components/infiniteScroll/VirtualAndInfiniteScroll'
import TrayWidgetItem from './TrayWidgetItem'

const S = {
  Tray: styled.div`
    padding: 0px 3px 5px 5px;
    width: 340px;
    background: rgb(255, 255, 255, 0.7);
    flex-grow: 0;
    flex-shrink: 0;
    position: fixed;
    z-index: 1000;
    overflow-y: hidden;
    height: 100%;
    box-shadow: 0 10px 30px -12px rgb(255 255 255 / 35%), 0 4px 25px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%);
  `
}

const TrayWidgetList = ({ trayItems, loading, activeTask, setActiveTask }) => {
  const [filters, setFilters] = useState(emptyString)
  const filteredList = trayItems
    ? filter(item => {
        return includes(filters.toLocaleLowerCase(), item?.name.toLocaleLowerCase())
      }, trayItems)
    : trayItems
  const scrollableList = filteredList?.map(item => ({ ...item, height: item.isSystemTask ? 50 : item.name.length > 30 ? 80 : 65 }))

  if (loading) return <LoadingFakeText lines={8} />
  return (
    <S.Tray>
      <DesignerMenu setActiveTask={setActiveTask} />
      <TrayWidgetFilter filters={filters} setFilters={setFilters} activeTask={activeTask} />
      <VirtualAndInfiniteScroll listItems={scrollableList} itemTemplate={TrayWidgetItem} />
    </S.Tray>
  )
}

TrayWidgetList.propTypes = {
  trayItems: PropTypes.array,
  loading: PropTypes.bool,
  activeTask: PropTypes.object.isRequired,
  setActiveTask: PropTypes.func.isRequired
}
export default TrayWidgetList
