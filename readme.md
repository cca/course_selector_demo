# Course Selector Demo

React autocomplete input connected to Opensearch index of CCA courses. Type a course detail, see a list of matching courses, select one, raw course JSON is saved in form.

What React libraries does Invenio use? Start with those. Look at other autocomplete widgets (Creatributor name, Community).

- react
- react-invenio-forms
- react-searchkit
- semantic-ui-react
- react-overridable

See [the react-searchkit demos](https://github.com/inveniosoftware/react-searchkit/tree/master/src/demos).

```sh
docker desktop start
# run opensearch
docker-compose up -d
# download course data
gsutil cp gs://int_files_source/course_section_data_AP_Spring_2025.json courses.json
node post courses.json courses # post course data to opensearch
npm run start # run the app frontend
```

Wipe index: `DELETE http://localhost:9200/courses`. Shouldn't need to do that in between `node post` because it uses a section ID.

http://localhost:9200/courses/_search?q=painting

Now to connect the search results to a JSON custom field?

## Notes

See [Tanza's writeup](https://cca-dev.atlassian.net/wiki/spaces/CP/pages/165937154/NEW+Search+on+Portal+with+Search+UI) of the new Portal search UI which moves away from searchkit. We may want to stick with what's available in Invenio anyway but he thought a lot about react<->elasticsearch search options and provides a framework for us to use.
