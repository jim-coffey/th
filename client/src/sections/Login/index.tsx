import React, { useEffect, useRef } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Card, Layout, Spin, Typography } from 'antd';
import { ErrorBanner } from '../../lib/components';
import { AUTH_URL } from '../../lib/graphql/queries';
import { LOG_IN } from '../../lib/graphql/mutations';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import {
  LogIn as LogInData,
  LogInVariables,
} from '../../lib/graphql/mutations/Login/__generated__/LogIn';
import {
  displaySuccessNotification,
  displayErrorMessage,
} from '../../lib/utils';
import { Viewer } from '../../lib/types';

import googleLogo from './assets/google_logo.jpg';

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = (props: Props) => {
  const { setViewer } = props;
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        displaySuccessNotification('You`ve successfully logged in!');
        sessionStorage.setItem('token', data.logIn.token);
      }
    },
    onError: () => {}, // necessary to test error state of component
  });
  const logInRef = useRef(logIn);
  const location = useLocation();

  useEffect(() => {
    // const code = new URL(window.location.href).searchParams.get('code');
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, [location.search]);

  const handleAuth = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });

      window.location.assign(data.authUrl);
    } catch (err) {
      displayErrorMessage(
        'Sorry! We weren`t able to log you in. Please try again later!'
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging In"></Spin>
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;

    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren`t able to log you in. Please try again later!" />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>

        <button className="log-in-card__google-button" onClick={handleAuth}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>

        <Text type="secondary">
          Note: By signing in, you'll be redirectoed to Google consent form to
          sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
