import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { DollarOutlined, SettingOutlined } from '@ant-design/icons'
import { SubstrateContextProvider, useSubstrate } from './substrate-lib'
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import AccountSelector from './AccountSelector'
import { DeveloperConsole } from './substrate-lib/components';
import Transaction from './Transaction';
import Management from './Management';
import 'semantic-ui-css/semantic.min.css';
import logo from './assets/logo.svg'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
const { Header, Sider, Content } = Layout

import './App.css'

function Main() {
    const [accountAddress, setAccountAddress] = useState(null);
    const { apiState, keyring, keyringState, apiError } = useSubstrate();
    const accountPair =
        accountAddress &&
        keyringState === 'READY' &&
        keyring.getPair(accountAddress);

    const loader = text =>
        <Dimmer active>
            <Loader size='small'>{text}</Loader>
        </Dimmer>;

    const message = err =>
        <Grid centered columns={2} padded>
            <Grid.Column>
                <Message negative compact floating
                    header='Error Connecting to Substrate'
                    content={`${JSON.stringify(err, null, 4)}`}
                />
            </Grid.Column>
        </Grid>;

    const onSelect = ({ key }) => {

    }

    if (apiState === 'ERROR') return message(apiError);
    else if (apiState !== 'READY') return loader('Connecting to Substrate');

    if (keyringState !== 'READY') {
        return loader('Loading accounts (please review any extension\'s authorization)');
    }

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    <img className="logo" src={logo} />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        onSelect={onSelect}
                    >
                        <Menu.Item key="1" icon={<DollarOutlined />}>
                            <Link to="/transaction">transaction</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<SettingOutlined />}>
                            <Link to="/management">management</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                        <AccountSelector setAccountAddress={setAccountAddress} />
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, height: '100%'}}>
                            <Switch>
                                <Route exact stric path="/transaction">
                                    <Transaction accountPair={accountPair} />
                                </Route>
                                <Route exact stric path="/management">
                                    <Management />
                                </Route>
                                <Route exact stric path="/">
                                    <Redirect to="/transaction" />
                                </Route>
                                <Route>
                                    <Transaction accountPair={accountPair} />
                                </Route>
                            </Switch>
                        </div>
                    </Content>
                    {/* <Footer style={{ textAlign: 'center' }}>Copyright © 2021, STONE</Footer> */}
                </Layout>
            </Layout>
            <DeveloperConsole></DeveloperConsole>
        </Router>
    )
}

export default function StoneApp() {
    return (
        <SubstrateContextProvider>
            <Main></Main>
        </SubstrateContextProvider>
    )
}