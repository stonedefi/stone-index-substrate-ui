# Stone Index Front End

## Usage

You can start the template in development mode to connect to a locally running node

```bash
yarn start
```

You can also build the app in production mode,

```bash
yarn build
```
and open `build/index.html` in your favorite browser.

After the website started, run the following scripts in the browser console to prepare some testing data:

```javascript
let alice = keyring.getPairs()[0];
await api.tx.assets.issue(10000).signAndSend(alice);
await api.tx.assets.issue(20000).signAndSend(alice);
let newIndex = [{ asset_id: 0, weight: 1 }, { asset_id: 1, weight: 1 }];
await api.tx.stoneIndex.addIndex(100, 'index-1', newIndex).signAndSend(alice);
```