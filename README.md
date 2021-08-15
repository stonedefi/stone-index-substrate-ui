# Stone Index Front End

## Quickstart
1. Before starting the frontend, the [stone node server](https://github.com/stonedefi/stoneindex-node) need to be started. It can be launched in single node mode quickly by the following command:

    ```bash
    git clone https://github.com/stonedefi/stoneindex-node.git
    make init
    make build
    make run
    ```

    or run with docker:

    ```bash
    docker run --rm -p 9944:9944 stonedefi/stone-index-substrate --dev --ws-external
    ```


2. You can launch the frontend in development mode to connect to a locally running node

    ```bash
    yarn start
    ```

    You can also build the app in production mode, and open `build/index.html` in your favorite browser.

    ```bash
    yarn build
    ```
    


3. After the website started, run the following scripts in the browser console to prepare the testing data of the initial balances and index:

    ```javascript
    let alice = keyring.getPairs()[0];
    for (let i = 0; i < 10; i++) {
        tx = await api.tx.assets.issue(10000).signAndSend(alice, { nonce: -1 });
        console.log(tx);
    }
    let newIndex = [{ asset_id: 0, weight: 1 }, { asset_id: 1, weight: 1 }];
    await api.tx.stoneIndex.addIndex(100, 'index-1', newIndex).signAndSend(alice, { nonce: -1 });
    ```
