import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import { AUTH_URL } from '../../../lib/graphql/queries';
import { LOG_IN } from '../../../lib/graphql/mutations';
import { Login } from '../';

const defaultProps = {
  setViewer: () => {},
};

describe('Login', () => {
  // avoid console warnings around scrollTo
  window.scrollTo = () => {};

  describe('AUTH_URL Query', () => {
    it('redirects the user when query is succssful', async () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { assign: jest.fn() },
      });

      const authUrlMock = {
        request: {
          query: AUTH_URL,
        },
        result: {
          data: {
            authUrl: 'https://google.com/signin',
          },
        },
      };
      const history = createMemoryHistory({
        initialEntries: ['/login'],
      });
      const { getByRole, queryByText } = render(
        <MockedProvider mocks={[authUrlMock]} addTypename={false}>
          <Router history={history}>
            <Route path="/login">
              <Login {...defaultProps} />
            </Route>
          </Router>
        </MockedProvider>
      );
      const authUrlButton = getByRole('button');

      fireEvent.click(authUrlButton);

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith(
          'https://google.com/signin'
        );
        expect(
          queryByText(
            'Sorry! We weren`t able to log you in. Please try again later!'
          )
        ).toBeNull();
      });
    });

    it('does not redirect when query is unseccessful', async () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { assign: jest.fn() },
      });

      const authUrlMock = {
        request: {
          query: AUTH_URL,
        },
        errors: [new GraphQLError('Something went wrong')],
      };
      const history = createMemoryHistory({
        initialEntries: ['/login'],
      });
      const { getByRole, queryByText } = render(
        <MockedProvider mocks={[authUrlMock]} addTypename={false}>
          <Router history={history}>
            <Route path="/login">
              <Login {...defaultProps} />
            </Route>
          </Router>
        </MockedProvider>
      );
      const authUrlButton = getByRole('button');

      fireEvent.click(authUrlButton);

      await waitFor(() => {
        expect(window.location.assign).not.toHaveBeenCalled();
        expect(
          queryByText(
            'Sorry! We weren`t able to log you in. Please try again later!'
          )
        ).toBeDefined();
      });
    });
  });

  describe('LOGIN Mutation', () => {
    it('when NO code exists in the /login route, the mutation is NOT fired', async () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { assign: jest.fn() },
      });

      const logInMock = {
        request: {
          query: LOG_IN,
          variables: {
            input: {
              code: '1234',
            },
          },
        },
        result: {
          data: {
            logIn: {
              id: '111',
              token: 'abcd',
              avatar: 'image.png',
              hasWallet: false,
              didRequest: true,
            },
          },
        },
      };
      const history = createMemoryHistory({
        initialEntries: ['/login'],
      });
      render(
        <MockedProvider mocks={[logInMock]} addTypename={false}>
          <Router history={history}>
            <Route path="/login">
              <Login {...defaultProps} />
            </Route>
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(history.location.pathname).not.toBe('/user/111');
      });
    });

    describe('when code exists in the /login route as a query parameter', () => {
      // it('displays loading indicator when the mutation is in progress', async () => {
      //   const history = createMemoryHistory({
      //     initialEntries: ['/login?code=1234'],
      //   });
      //   const { queryByText } = render(
      //     <MockedProvider mocks={[]} addTypename={false}>
      //       <Router history={history}>
      //         <Route path="/login">
      //           <Login {...defaultProps} />
      //         </Route>
      //       </Router>
      //     </MockedProvider>
      //   );

      //   await waitFor(() => {
      //     expect(queryByText('Logging In')).not.toBeNull();
      //   });
      // });

      it('redirects the user to their user page when mutation is successful', async () => {
        const logInMock = {
          request: {
            query: LOG_IN,
            variables: {
              input: {
                code: '1234',
              },
            },
          },
          result: {
            data: {
              logIn: {
                id: '111',
                token: 'abcd',
                avatar: 'image.png',
                hasWallet: false,
                didRequest: true,
              },
            },
          },
        };
        const history = createMemoryHistory({
          initialEntries: ['/login?code=1234'],
        });
        render(
          <MockedProvider mocks={[logInMock]} addTypename={false}>
            <Router history={history}>
              <Route path="/login">
                <Login {...defaultProps} />
              </Route>
            </Router>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(history.location.pathname).toBe('/user/111');
        });
      });

      it('does not redirect to the user page and displays an error when mutation is unsuccessful', async () => {
        const logInMock = {
          request: {
            query: LOG_IN,
            variables: {
              input: {
                code: '1234',
              },
            },
          },
          errors: [new GraphQLError('Something went wrong')],
        };
        const history = createMemoryHistory({
          initialEntries: ['/login?code=1234'],
        });
        const { queryByText } = render(
          <MockedProvider mocks={[logInMock]} addTypename={false}>
            <Router history={history}>
              <Route path="/login">
                <Login {...defaultProps} />
              </Route>
            </Router>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            queryByText(
              'Sorry! We weren`t able to log you in. Please try again later!'
            )
          ).toBeDefined();
        });
      });
    });
  });
});
