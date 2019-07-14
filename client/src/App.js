import React, { Component } from "react";
import { toast } from 'react-toastify';

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Box from 'react-bulma-components/lib/components/box';
import Button from 'react-bulma-components/lib/components/button';
import Progress from 'react-bulma-components/lib/components/progress';
import Table from 'react-bulma-components/lib/components/table';

import {
  Field,
  Control,
  Label,
  Input,
} from 'react-bulma-components/lib/components/form';

class App extends Component {
  state = {
    // web3/global stuff
    web3: null,
    accounts: null,
    contract: null,
    loading: true,
    fatalError: false,
    // local stuff
    storedValue: 0,
    inputValue: '',
    operationLoading: false,
    txHashes: []
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getLatestStoredValue);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);

      this.setState({
        loading: false,
        fatalError: true
      })
    }
  };

  getLatestStoredValue = async () => {
    const { contract } = this.state;

    const response = await contract.methods.get().call();

    this.setState({ storedValue: response, loading: false });
  }

  submitNewValue = async () => {
    const { accounts, contract, inputValue, txHashes } = this.state;

    this.setState({
      operationLoading: true
    });

    try {
      // Set new value
      const operationResult = await contract.methods.set(inputValue).send({ from: accounts[0] });
      txHashes.push({
        from: operationResult.from,
        link: operationResult.transactionHash
      });

      toast.success('The operation was succesful!');


      // Read it directly from the network
      const response = await contract.methods.get().call();

      this.setState({
        inputValue: '',
        storedValue: response,
        operationLoading: false,
        txHashes: txHashes
      });
    } catch (error) {
      console.error(error)
      toast.error('Oh no! There was an error during the operation, or it has been rejected')

      this.setState({
        operationLoading: false
      });
    }
  }

  render() {
    const { loading, fatalError, operationLoading, storedValue, inputValue, txHashes } = this.state

    if (loading) {
      return <Progress style={{ borderRadius: 0 }} max={100} color="primary" size="small" />
    }

    if (fatalError) {
      return (
        <Section>
          <Container>
            <Heading>
              Fatal error, check the console for more
            </Heading>
          </Container>
        </Section>
      )
    }

    return (
      <div>
        <Section>
          <Container>
            <Heading style={{ display: 'flex', justifyContent: 'center' }}>Smart contract</Heading>

            <Box>
              <Heading subtitle size={4}>
                Value stored inside the contract: {storedValue}
              </Heading>

              <Field>
                <Label>Enter a new value for the contract state</Label>
                <Control>
                  <Input
                    style={{ marginBottom: '1rem' }}
                    onChange={evt => this.setState({ inputValue: evt.target.value })}
                    value={inputValue}
                    type="number"
                  />
                </Control>
                <Control>
                  <Button
                    color="primary"
                    className={operationLoading ? 'is-loading' : ''}
                    onClick={() => this.submitNewValue()} >
                    Submit
                  </Button>
                  {operationLoading &&
                    <span style={{ display: 'inline-block', marginTop: '6px', marginLeft: '1rem' }}>
                      Please open Metamask and accept the transaction...
                    </span>
                  }
                </Control>
              </Field>
            </Box>
          </Container>
        </Section >

        {txHashes.length > 0 && (
          <Section>
            <Container>
              <Heading>Transactions log</Heading>

              <Table>
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>TX Link</th>
                  </tr>
                </thead>
                <tbody>
                  {txHashes.map((t, i) => (
                    <tr key={i}>
                      <th>{t.from}</th>
                      <td>
                        <a href={`https://ropsten.etherscan.io/tx/${t.link}`}>
                          {`https://ropsten.etherscan.io/tx/${t.link}`}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Section>
        )}
      </div>

    );
  }
}

export default App;
