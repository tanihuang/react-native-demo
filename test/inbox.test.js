const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3').default;
const web3 = new Web3(ganache.provider());

class Car {
  park() {
    return 'stopped';
  }

  drive() {
    return 'vroom';
  }
}

describe('Car', () => {
  it('can park', () => {
    const car = new Car();
    assert.equal(car.park(), 'stopped');
  });

  it('can drive', () => {
    const car = new Car();
    assert.equal(car.drive(), 'vroom');
  });
});

beforeEach(() => {
  web3.eth.getAccounts().then(params => {
    console.log('params: ', params);
  });
});

describe('Inbox', () => {
  it('deploys a contract', () => {});
});

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

