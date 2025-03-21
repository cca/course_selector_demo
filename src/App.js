import React, {Component} from 'react'
import {EmptyResults, Error, ESSearchApi, ResultsLoader, ReactSearchKit, SearchBar, withState } from 'react-searchkit'
import {Container} from 'semantic-ui-react'
import {Results} from "./Results"
import 'semantic-ui-css/semantic.min.css'

const OnResults = withState(Results)

// OSSearchAPI is not in a react-searchkit release yet but in HEAD
// ESSearchAPI works in the meantime
const searchApi = new ESSearchApi({
    axios: {
        url: 'http://localhost:9200/courses/_search',
        timeout: 5000,
    }
})

class App extends Component {
    render() {
        return (
            <Container>
                {/* https://inveniosoftware.github.io/react-searchkit/docs/components/react-searchkit */}
                <ReactSearchKit appName="course-search" searchApi={searchApi} searchOnInit={false} urlHandlerApi={{enabled: false}}>
                    <div style={{margin: '2em auto', width: '50%'}}>
                        <SearchBar />
                        <ResultsLoader>
                            <EmptyResults />
                            <Error />
                            <OnResults />
                        </ResultsLoader>
                    </div>
                </ReactSearchKit>
            </Container>
        )
    }
}

export default App;
