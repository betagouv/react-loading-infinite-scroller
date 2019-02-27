import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import withQueryRouter from 'with-query-router'

const REACHABLE_THRESHOLD = -10
const UNREACHABLE_THRESHOLD = -10000

class LoadingInfiniteScroll extends PureComponent {
  constructor() {
    super()
    this.state = {
      hasResetPage: false,
      page: null,
      resetCount: 0,
      threshold: REACHABLE_THRESHOLD
    }
  }

  componentDidMount () {
    this.handleResetPage()
  }

  componentDidUpdate (prevProps) {
    const { isLoading, query } = this.props
    const { page } = this.state
    const queryParams = query.parse()

    if (!isLoading && prevProps.isLoading) {
      this.handleResetThreshold()
    }

    if (!queryParams.page && page) {
      this.handleResetScroll()
      return
    }

    this.handleResetPageHasBeenDone()
  }


  handleResetScroll = () => {
    const { hasResetPage } = this.state
    if (hasResetPage) {
      this.setState(({ resetCount }) => ({
        page: null,
        resetCount: resetCount + 1
      }))
    }
  }

  handleResetThreshold = () => {
    this.setState({ threshold: REACHABLE_THRESHOLD })
  }

  handleResetPage = () => {
    const { query } = this.props
    const queryParams = query.parse()
    if (queryParams.page) {
      query.change({ page: null })
    }
  }

  handleResetPageHasBeenDone = () => {
    const { query } = this.props
    const queryParams = query.parse()
    const { hasResetPage } = this.state

    if (hasResetPage) {
      return
    }

    if (!queryParams.page) {
      this.setState({ hasResetPage: true })
    }
  }

  loadMore = page => {
    const { isLoading, query } = this.props
    if (isLoading) {
      return
    }

    this.setState(
      { page, threshold: UNREACHABLE_THRESHOLD },
      () => query.change({ page }, { historyMethod: 'replace' })
    )
  }

  render() {
    const {
      children,
      query,
      ...ReactInfiniteScrollerProps
    } = this.props
    const {
      className,
      element,
      getScrollParent,
      hasMore,
      loader,
      useWindow,
    } = ReactInfiniteScrollerProps
    const { hasResetPage, resetCount, threshold } = this.state
    const queryParams = query.parse()

    const pageStart = parseInt(queryParams.page || 1, 10)

    if (!hasResetPage) {
      return null
    }

    const thresholdDependingOnChildren = (children && children.length)
      ? threshold
      : UNREACHABLE_THRESHOLD

    return (
      <InfiniteScroll
        className={className}
        element={element}
        getScrollParent={getScrollParent}
        hasMore={hasMore}
        key={resetCount}
        loader={loader}
        loadMore={this.loadMore}
        pageStart={pageStart}
        threshold={thresholdDependingOnChildren}
        useWindow={useWindow}
      >
        {children}
      </InfiniteScroll>
    )
  }
}

LoadingInfiniteScroll.defaultProps = {
  isLoading: false,
  ...InfiniteScroll.defaultProps
}
delete InfiniteScroll.defaultProps.loadMore


LoadingInfiniteScroll.propTypes = {
  isLoading: PropTypes.bool,
  query: PropTypes.object.isRequired,
  ...InfiniteScroll.propTypes
}
delete LoadingInfiniteScroll.propTypes.loadMore

export default withQueryRouter(LoadingInfiniteScroll)
