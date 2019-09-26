import PropTypes from 'prop-types'
import { parse } from 'query-string'
import React, { PureComponent } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

const REACHABLE_THRESHOLD = -10
const UNREACHABLE_THRESHOLD = -10000

export class LoadingInfiniteScroll extends PureComponent {
  constructor() {
    super()
    this.state = {
      hasResetPage: false,
      page: null,
      resetCount: 0,
      threshold: REACHABLE_THRESHOLD,
    }
  }

  componentDidMount() {
    this.handleResetPage()
  }

  componentDidUpdate(prevProps) {
    const { isLoading } = this.props
    const { page } = this.state
    const queryParams = parse(window.location.search)

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
        resetCount: resetCount + 1,
      }))
    }
  }

  handleResetThreshold = () => {
    this.setState({ threshold: REACHABLE_THRESHOLD })
  }

  handleResetPage = () => {
    const { handlePageReset } = this.props
    const queryParams = parse(window.location.search)
    if (queryParams.page) {
      handlePageReset()
    }
  }

  handleResetPageHasBeenDone = () => {
    const queryParams = parse(window.location.search)
    const { hasResetPage } = this.state

    if (hasResetPage) {
      return
    }

    if (!queryParams.page) {
      this.setState({ hasResetPage: true })
    }
  }

  loadMore = page => {
    const { handlePageChange, hasMore, isLoading } = this.props
    if (isLoading || !hasMore) {
      return
    }

    this.setState({ page, threshold: UNREACHABLE_THRESHOLD }, () =>
      handlePageChange(page)
    )
  }

  render() {
    const { children, ...ReactInfiniteScrollerProps } = this.props
    const {
      className,
      element,
      getScrollParent,
      hasMore,
      loader,
      useWindow,
    } = ReactInfiniteScrollerProps
    const { hasResetPage, resetCount, threshold } = this.state
    const queryParams = parse(window.location.search)

    const pageStart = parseInt(queryParams.page || 1, 10)

    if (!hasResetPage) {
      return null
    }

    const thresholdDependingOnChildren =
      children && children.length ? threshold : UNREACHABLE_THRESHOLD

    return (
      <InfiniteScroll
        className={className}
        element={element}
        getScrollParent={getScrollParent}
        hasMore={hasMore}
        key={resetCount}
        loadMore={this.loadMore}
        loader={loader}
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
  ...InfiniteScroll.defaultProps,
}
delete InfiniteScroll.defaultProps.loadMore

LoadingInfiniteScroll.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePageReset: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
}

export default LoadingInfiniteScroll
