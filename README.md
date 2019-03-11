# react-loading-infinite-scroller

[![CircleCI](https://circleci.com/gh/betagouv/react-loading-infinite-scroller/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/react-loading-infinite-scroller/tree/master)
[![npm version](https://img.shields.io/npm/v/react-loading-infinite-scroller.svg?style=flat-square)](https://npmjs.org/package/react-loading-infinite-scroller)

## Basic Usage

```javascript
import LoadingInfiniteScroll from 'loading-infinite-scroller'
import { assignData, requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'


class FoosPage extends Component {
  constructor (props) {
    super(props)
    const { dispatch } = props

    this.state = {
      hasMore: false,
      isLoading: false
    }

    dispatch(assignData({ foos: [] }))
  }

  componentDidMount() {
    this.handleRequestData()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (location.search !== prevProps.location.search) {
      this.handleRequestData()
    }
  }

  handleRequestData = (handleSuccess, handleFail) => {
    const { user, dispatch, location } = this.props
    const { search } = location

    const path = `foos${search}`

    this.setState({ isLoading: true }, () => {
      dispatch(
        requestData('GET', path, {
          handleFail: () => {
            this.setState({
              hasMore: false,
              isLoading: false
            })
          },
          handleSuccess: (state, action) => {
            this.setState({
              hasMore: action.data && action.data.length > 0,
              isLoading: false
            })
          }
        })
      )
    })

  render () {
    const { foos, query } = this.props
    const { hasMore, isLoading } = this.state

    return (
      <LoadingInfiniteScroll
          hasMore={hasMore}
          isLoading={isLoading}
          useWindow
        >
          {
            foos.map(offerer =>
              <OffererItem article={foo} key={foo.id} />
            )
          }
        </LoadingInfiniteScroll>
    )
  }
}

FoosPage.defaultProps = {
  foos: null
}

FoosPage.propTypes = {
  foos: PropTypes.array
}

function mapStateToProps(state) {
  return {
    foos: state.data.foos
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(FoosPage)
```
