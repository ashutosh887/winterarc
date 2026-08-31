import { Component } from 'react'

// Wraps decoration only. The Three.js hero throws if the device or browser cannot
// create a WebGL context, and without this the root boundary would treat that as a
// crash, clear the caches, reload and then show the error screen on the landing page.
export default class QuietBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
