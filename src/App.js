import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink({ uri: 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql' }),
  cache: new InMemoryCache()
});

const query = gql`
  query agencies {
    agencies {
      id
      name
    }	
  }
`;

const renderAgencies = (data) => {
  const list = data.map(i => <li key={i.id}>{i.name}</li>)
  return list;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      agencies: [],
    };
  }
  componentDidMount() {
    client.query({
      query,
      variables: null,
    })
    .then(({ data }) => {
      const { agencies } = data;
      this.setState({ ...this.state, agencies });
    })
    .catch(err => console.log(err))
  }
  render() {
    const { agencies } = this.state;
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <h1>Agencies:</h1>
          <ul>
            {agencies.length ? renderAgencies(agencies) : <p>loading...</p>}
          </ul>

        </div>
      </ApolloProvider>
    );
  }
}

export default App;
