## Testing Guide for Project Stone Index on Substrate

To ensure the code quality and functionality, a few tests are in different places(repo or folders), this document captures all steps and expected results 

### Components

There are 3 major components in the curren stage:
* [stoneindex-node](https://github.com/stonedefi/stoneindex-node) The core component of Stone index built on top of Substrate framework
* [stone-index-substrate-ui](https://github.com/stonedefi/stone-index-substrate-ui) The user interface for different users, e.g. the token holders or index manager
* [stone-index-swaps-integration-demo](https://github.com/stonedefi/stone-index-swaps-integration-demo) A demo of integrating stone index with pallet-swap

### Unit testing
The code have unit-test coverage to ensure functionality and robustness. Here are the steps how to run these tests

#### stoneindex-node
* Pull [stoneindex-node](https://github.com/stonedefi/stoneindex-node) repo
* Install the necessary libraries including latest version of Rust, Cargo and make libaries
* Use any commandline interface like Terminal or Bash shell, go into the folder of the repo
* Trigger the test command:
``` cargo test```
* Expected results:
>> Compile successfully
>> All test cases should be passed

#### stone-index-substrate-ui
* Pull [stone-index-substrate-ui](https://github.com/stonedefi/stone-index-substrate-ui) repo
* Install the necessary libraries including: 
>> "node": ">=12"
>> "npm": ">=6"
* Use any commandline interface like Terminal or Bash shell, go into the folder of the repo
* Install the dependencies:
``` yarn install ```
* Trigger the test command:
``` yarn test ```
* Expected results:
>> All test cases should be passed


### Functional testing
To ensure the code funtional, and work together correctly, functional testing is needed before any new features or fixes to be pushed into repo with the following steps

* Follow the above steps in the unit testing, and ensure the code, envrionment and libraries are valid
* Start the node following the steps in [README](https://github.com/stonedefi/stoneindex-node/blob/master/README.md) to lauch the node
* Start the UI under stone-index-substrate-ui folder with command:
``` yarn start ```
* Following the steps in [Tutorial](https://github.com/stonedefi/stone-index-substrate-ui/blob/master/tutorial/Tutorial.md) to test all the functions 
* All the functions should work as expected 


