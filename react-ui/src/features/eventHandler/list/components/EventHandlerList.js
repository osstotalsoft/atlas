import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import EventHandlerItem from './EventHandlerItem'
import { IconButton, Card, FakeText, Pagination } from '@totalsoft/rocket-ui'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from '../styles/styles'
import { defaults } from 'apollo/defaultCacheData'
import { eventHandlersPager } from 'apollo/cacheKeyFunctions'

const defaultPager = defaults[eventHandlersPager]
const useStyles = makeStyles(styles)

const EventHandlerList = ({ pager, setPager, onRefresh, onDeleteHandler, onEditHandler, onAddHandler, handlerList, loading }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { page, pageSize, totalCount } = pager
  const currentPageHandlers = handlerList.slice(page * pageSize, (page + 1) * pageSize)

  const handleRowsPerPageChange = useCallback(newPageSize => setPager({ ...defaultPager, pageSize: parseInt(newPageSize, 10) }), [setPager])
  const handlePageChange = useCallback(
    newPage => {
      setPager(currentPager => ({ ...currentPager, page: newPage }))
    },
    [setPager]
  )

  useEffect(() => {
    if (handlerList && totalCount !== handlerList.length) setPager(currentPager => ({ ...currentPager, totalCount: handlerList?.length }))
  }, [totalCount, setPager, handlerList])

  return (
    <Card
      icon={NotificationsIcon}
      title={t('EventHandler.EventHandlers')}
      actions={[<IconButton key='addButton' type='add' color='secondary' title={t('EventHandler.Buttons.AddEventHandler')} onClick={onAddHandler} />]}
    >
      {loading ? (
        <FakeText lines={10} />
      ) : (
        <>
          <Grid className={classes.enableScrollX}>
            <Table className={classes.table}>
              <Thead>
                <Tr>
                  <Th className={classes.tableHeader}>{t('EventHandler.Active')}</Th>
                  <Th className={classes.tableHeader}>{t('EventHandler.Name')}</Th>
                  <Th className={classes.tableHeader}>{t('EventHandler.Sink')}</Th>
                  <Th className={classes.tableHeader}>{t('EventHandler.Condition')}</Th>
                  <Th className={classes.tableHeader}>{t('EventHandler.Actions')}</Th>
                  <Th className={classes.tableHeader} />
                </Tr>
              </Thead>
              <Tbody>
                {currentPageHandlers?.map((handler, index) => (
                  <EventHandlerItem key={index} handler={handler} onDeleteHandler={onDeleteHandler} onEditHandler={onEditHandler} />
                ))}
              </Tbody>
            </Table>
          </Grid>
          <Pagination
            count={totalCount}
            pageSize={pageSize}
            page={page}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageChange={handlePageChange}
            onRefresh={onRefresh}
          />
        </>
      )}
    </Card>
  )
}

EventHandlerList.propTypes = {
  handlerList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  pager: PropTypes.object.isRequired,
  setPager: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onDeleteHandler: PropTypes.func.isRequired,
  onEditHandler: PropTypes.func.isRequired,
  onAddHandler: PropTypes.func.isRequired
}

export default EventHandlerList
