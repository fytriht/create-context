import React, { Component } from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'

export default function createContext(defaultValue, options) {
  options = options || {}

  const emitter = createEmitter()
  const displayName = options.displayName || 'create-context'
  const is = Object.is

  let isProviderMounted = false

  class Provider extends Component {
    static displayName = displayName + '-provider'

    static propTypes = {
      value: PropTypes.any.isRequired,
    }

    componentDidMount() {
      isProviderMounted = true
      if (!is(this.props.value, defaultValue)) defaultValue = this.props.value
    }

    componentWillReceiveProps(nextProps) {
      if (!is(nextProps.value, this.props.value))
        emitter.publish(nextProps.value)
    }

    render() {
      return this.props.children
    }
  }

  class Consumer extends Component {
    static displayName = displayName + '-comsumer'

    static propTypes = {
      children: PropTypes.func.isRequired,
    }

    state = {
      value: defaultValue,
    }

    componentDidMount() {
      warning(
        isProviderMounted,
        Consumer.displayName +
          ': Consumer is rendered without a matching provider.' +
          'Using default value instead',
      )

      this.unsubscribe = emitter.subscribe(value => this.setState({ value }))
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return this.props.children(this.state.value)
    }
  }

  return { Provider, Consumer }
}

function createEmitter() {
  const handlers = []
  return {
    subscribe(fn) {
      handlers.push(fn)
      return () => {
        handlers.splice(handlers.indexOf(fn), 1)
      }
    },
    publish(value) {
      handlers.forEach(i => i(value))
    },
  }
}
