import { useState, useEffect } from 'react';
import { Space, Divider, Input, Button, BackTop } from 'antd';
import { useSubstrate } from './substrate-lib';
import { coin } from './config/coin'
import { web3FromSource } from '@polkadot/extension-dapp';

function Transaction(props) {
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
        <>
            <BackTop />
            {currentIndexes.map((index, _) => (
                <SubTransaction accountPair={accountPair} indexId={index.stoneId.toNumber()} key={index.stoneId.toNumber()}
                    indexName={index.name.toHuman()} components={index.components} />
            ))}
        </>
    )
}

function SubTransaction(props) {
    const { api } = useSubstrate();
    const { accountPair, indexName, indexId, components } = props;
    const [amountValue, setAmountValue] = useState(0);
    const [balance, setBalance] = useState('');
    const [status, setStatus] = useState(null);
    const [unsub, setUnsub] = useState(null);
    const sum = components.reduce((sum, cur) => sum + Number(cur.weight || 0), 0)

    const getFromAcct = async () => {
      const {
        address,
        meta: { source, isInjected }
      } = accountPair;
      let fromAcct;
  
      // signer is from Polkadot-js browser extension
      if (isInjected) {
        const injected = await web3FromSource(source);
        fromAcct = address;
        api.setSigner(injected.signer);
      } else {
        fromAcct = accountPair;
      }
  
      return fromAcct;
    };

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
      const fromAcct = await getFromAcct();

      if (unsub) {
        unsub();
        setUnsub(null);
      }
  
      setStatus('Sending...');
      const newUnsub = await api.tx.stoneIndex.buyIndex(indexId, amountValue).signAndSend(fromAcct, txResHandler)
        .catch(txErrHandler);
      setUnsub(() => newUnsub);
    };
  
    const sellTransaction = async () => {
      const fromAcct = await getFromAcct();

      if (unsub) {
        unsub();
        setUnsub(null);
      }
  
      setStatus('Sending...');
      const newUnsub = await api.tx.stoneIndex.sellIndex(indexId, amountValue).signAndSend(fromAcct, txResHandler)
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
        <div className="manage-container" style={{ width: '600px' }}>
            <div className="divName">{indexName}</div>
            <div>ID: {indexId}</div>
            <div className="mtpx">
                <Space split={<Divider type="vertical" />}>
                    {components.map((comp, _) => (
                        <div className="per" key={indexId + '_' + comp.assetId.toNumber()}>
                            {coin[comp.assetId.toNumber()]}&nbsp;&nbsp;&nbsp;
                            {((comp.weight.toNumber() / sum) * 100).toFixed()} %
                        </div>
                    ))}
                </Space>
            </div>
            <div className="mtpx">Balance: {balance}</div>
            <div style={{ marginTop: '8px' }}>
                <Input
                    type="number" 
                    addonBefore="Amount"
                    value={amountValue}
                    onChange={(e) => setAmountValue(e.target.value)}
                />
            </div>
            <div className="buy-sell">
                <div className="bsbut">
                    <Button type="primary" block onClick={buyTransaction}
                        disabled={Number(amountValue) === 0}
                    >
                        Buy
                    </Button></div>
                <div className="bsbut">
                    <Button type="primary" block onClick={sellTransaction} danger
                        disabled={Number(amountValue) === 0}
                    >
                        Sell
                    </Button>
                </div>
            </div>
            <div style={{ marginTop: '12px', overflowWrap: 'break-word' }}>{status}</div>
        </div>
    )
}

export default Transaction