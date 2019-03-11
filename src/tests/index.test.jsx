import React from 'react'
import { shallow } from 'enzyme'

import { RawLoadingInfiniteScroll } from '../index'

describe('RawLoadingInfiniteScroll', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      // given
      const props = {
        query: {
          parse: () => ({})
        },
      }

      // when
      const wrapper = shallow(
        <RawLoadingInfiniteScroll {...props}>
          <div />
        </RawLoadingInfiniteScroll>
      )

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
