import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Table, Header, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The currently stored value
  const [currentIndexes, setCurrentIndexes] = useState([]);

  useEffect(() => {
    let unsubscribe;
    api.query.stoneIndex.indexes.entries(newValue => {
      setCurrentIndexes(newValue.map(i => i[1]));
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.stoneIndex]);

  return (
    <Grid.Column>
      <h1>Stone Index</h1>
      <Card.Group>
      {currentIndexes.map((index, _) => (
        <IndexCard accountPair={accountPair} indexId={index.stoneId.toNumber()} key={index.stoneId.toNumber()}
          indexName={index.name.toHuman()} components={index.components} />
      ))}
      </Card.Group>
    </Grid.Column>
  );
}

function IndexCard (props) {
  const { api } = useSubstrate();
  const { accountPair, indexName, indexId, components } = props;

  // The transaction submission status
  const [balance, setBalance] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [status, setStatus] = useState(null);
  const [unsub, setUnsub] = useState(null);

  const txResHandler = ({ events = [], status }) => {
    if (status.isFinalized) {
      setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
      });
    } else {
      setStatus(`Current transaction status: ${status.type}`);
    }
  };

  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`);

  const buyTransaction = async () => {
    if (unsub) {
      unsub();
      setUnsub(null);
    }

    setStatus('Sending...');
    const newUnsub = await api.tx.stoneIndex.buyIndex(indexId, amountValue).signAndSend(accountPair, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => newUnsub);
  };

  const sellTransaction = async () => {
    if (unsub) {
      unsub();
      setUnsub(null);
    }

    setStatus('Sending...');
    const newUnsub = await api.tx.stoneIndex.sellIndex(indexId, amountValue).signAndSend(accountPair, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => newUnsub);
  };

  useEffect(() => {
    let unsubscribe;
    api.query.stoneIndex.indexBalances([indexId, accountPair.address], balance => {
      setBalance(balance.toNumber());
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.stoneIndex, indexId, components, accountPair]);

  return (
    <Card>
      <Card.Content>
        <Card.Header>{indexName}</Card.Header>
        <Card.Meta>ID: {indexId}</Card.Meta>
        <Card.Description>
          <Table celled padded>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Asset Id</Table.HeaderCell>
                <Table.HeaderCell>Weight</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
            {components.map((comp, _) => (
              <Table.Row key={indexId + '_' + comp.assetId.toNumber()}>
                <Table.Cell>{comp.assetId.toNumber()}</Table.Cell>
                <Table.Cell>{comp.weight.toNumber()}</Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Header size='small'>Balance: {balance}</Header>
        <Form>
          <Form.Field>
            <Input
              label='Amount'
              type='number'
              onChange={(_, { value }) => setAmountValue(value)}
            >
            </Input>
          </Form.Field>
          <div className='ui two buttons'>
              <Button basic color='green' type='submit' onClick={buyTransaction}>Buy</Button>
              <Button basic color='red' type='submit' onClick={sellTransaction}>Sell</Button>
          </div>
          <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form>
      </Card.Content>
    </Card>
  );
}

export default function StoneIndex (props) {
  const { api } = useSubstrate();
  return api.query.stoneIndex && api.query.stoneIndex.indexes
    ? <Main {...props} />
    : null;
}

async function init () {
  newIndex = [{ asset_id: 0, weight: 1 }, { asset_id: 1, weight: 1 }];
  let alice = keyring.getPairs()[0];
  await api.tx.stoneIndex.addIndex(100, 'index-1', newIndex).signAndSend(alice);
  newIndex = [{ asset_id: 1, weight: 1 }, { asset_id: 2, weight: 5 }, { asset_id: 3, weight: 10 }];
  await api.tx.stoneIndex.addIndex(101, 'index-2', newIndex).signAndSend(alice);
}
