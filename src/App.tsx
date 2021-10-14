import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.scss';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import { Col, Row, Spin } from 'antd';
import MainPage from './pages/MainPage/MainPage';

const RepositoriesPage = lazy(() => import('./pages/RepositoriesPage/RepositoriesPage'));
const RepositoryContentPage = lazy(() => import('./pages/RepositoryContentPage/RepositoryContentPage'));

function App() {

  return (
    <div className="App">
      <Router>
        <Layout className="layout">
          <Header>
            <h1 style={{color: 'white'}}>Github repo viewer app</h1>
          </Header>
          
          <Content>
            <Row>
              <Col span={12} offset={6}>
              
                <Suspense fallback={
                  <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}/>
                }>
                  <Switch>
                    <Route exact path={`${process.env.PUBLIC_URL}/`}>
                      <MainPage />
                    </Route>

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/:username`}
                      render={(p)=>(<RepositoriesPage {...p}  />)}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/:username/:repositoryName`}
                      render={(p)=>(<RepositoryContentPage {...p}  />)}
                    />
                  </Switch>
                </Suspense>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
