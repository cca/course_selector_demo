/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019-2022 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
// https://github.com/inveniosoftware/react-searchkit/blob/master/src/demos/opensearch/Results.js
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import {
  ActiveFilters,
  Count,
  LayoutSwitcher,
  ResultsMultiLayout,
} from "react-searchkit"

// https://github.com/inveniosoftware/react-searchkit/blob/master/src/lib/components/ResultsList/ResultsList.js
const MyResultsListItem = ({result, index}) => {
    console.log("result", result)
    return (
        <div key={index} href={null}>
            <p>
                {result.term.replace("AP_", "").replace("_", " ")} {result.section_code} {result.course_title} {result.instructors.length ? result.instructors.map(i => `${i.first_name} ${i.last_name}`).join(", "): ""}
            </p>
        </div>
    )
}

export class Results extends Component {
  render() {
    const { currentResultsState } = this.props;
    const { data } = currentResultsState;
    const { total, hits } = data;
    console.log('results', data && data.total); // Log the data to verify it
    return total ? (
      <>
        <Grid relaxed>
          <ActiveFilters />
        </Grid>
        <Grid relaxed verticalAlign="middle">
          <Grid.Column width={8}>
            <span style={({ marginLeft: "0.5em" }, { marginRight: "0.5em" })}>
              <Count label={(cmp) => <>Found {cmp}</>} />
            </span>
          </Grid.Column>
          <Grid.Column width={8} textAlign="right">
            <LayoutSwitcher defaultLayout="grid" />
          </Grid.Column>
        </Grid>
        <Grid relaxed style={{ padding: "2em 0" }}>
          <ResultsMultiLayout />
        </Grid>
        <Grid relaxed>
          {hits.map((hit, index) => (
            <MyResultsListItem key={index} result={hit} index={index.toString()} />
          ))}
        </Grid>
      </>
    ) : null;
  }
}

Results.defaultProps = {}
