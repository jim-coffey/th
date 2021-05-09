import React, { useState, useEffect } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Input, Layout } from 'antd';
import { MenuItems } from './components';
import { displayErrorMessage } from '../../lib/utils';
import { Viewer } from '../../lib/types';

import logo from './assets/tinyhouse-logo.png';

const { Header } = Layout;
const { Search } = Input;

interface Props extends RouteComponentProps {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = withRouter(
  ({ viewer, setViewer, history, location }: Props) => {
    const [search, setSearch] = useState('');

    useEffect(() => {
      const { pathname } = location;

      if (pathname.includes('/listings/')) {
        const pathParts = pathname.split('/');

        setSearch(pathParts[pathParts.length - 1]);
      }
    }, [location]);

    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else if (value) {
        displayErrorMessage('Please enter a valid search!');
      }
    };

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              placeholder="Search Locations e.g. 'San Fransisco'"
              enterButton
              value={search}
              onChange={evt => setSearch(evt.target.value)}
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
