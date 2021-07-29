# RTK Query Example App

This is an example app to demonstrate adding basic tests to a simple [RTK Query][rtk-query] implementation.

## Tests

* The test script [here][service-tests] provides an approach for adding basic tests to your RTK Query service. The tests cover success and error scenarios a query endpoint and a mutation endpoint.
* The test script [here][hooks-tests] provides an approach for adding tests for your RTK Query service's automatically generated React hooks.
* There are some [other tests][tests-dir] which demonstrate testing basic redux functionality like selectors and actions.

## Prerequisites

Install dev requirements by running `yarn` in the project root.

## Running the tests

In the project root run `yarn test`.

## Starting the app

This project includes a very primitive applcation which exercises the RTK Query implementation. The implementation uses [MSW][msw] as a mock service. You can alter the behavior of the mock service [here][handlers]

In the project root run `yarn start`. The application will be available on port 3000 by default.

[rtk-query]: https://redux-toolkit.js.org/rtk-query/overview
[msw]: https://mswjs.io/
[tests-dir]: https://github.com/johnpooch/rtk-query-example-app/tree/main/src/store/__tests__
[service-tests]: https://github.com/johnpooch/rtk-query-example-app/tree/main/src/store/__tests__/service.test.ts
[hooks-tests]: https://github.com/johnpooch/rtk-query-example-app/blob/main/src/hooks/__tests__/service.test.tsx
[handlers]: https://github.com/johnpooch/rtk-query-example-app/blob/main/src/mockService/handlers.js
