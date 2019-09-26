import React from 'react'
import { shallow } from 'enzyme'

import { LoadingInfiniteScroll } from '../index'

describe('test LoadingInfiniteScroll', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      // given
      const props = {
        handlePageChange: jest.fn(),
        handlePageReset: jest.fn(),
      }

      // when
      const wrapper = shallow(
        <LoadingInfiniteScroll {...props}>
          <div />
        </LoadingInfiniteScroll>
      )

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
