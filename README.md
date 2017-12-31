# Create-Context
An implementation of [the context RFC](https://github.com/reactjs/rfcs/pull/2).

## Usage
```js
const ThemeContext = createContext('light')

class ThemeToggler extends React.Component {
  state = {
    theme: 'light',
  }
  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <button
          onClick={() =>
            this.setState(state => ({
              theme: state.theme === 'light' ? 'dark' : 'light',
            }))
          }
        >
          Toggle theme
        </button>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

class Title extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <h1 style={{ color: theme === 'light' ? '#000' : '#fff' }}>
            {this.props.children}
          </h1>
        )}
      </ThemeContext.Consumer>
    )
  }
}
```
