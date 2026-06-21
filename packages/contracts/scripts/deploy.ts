import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying KodaPilot contracts to 0G testnet...');

  // TODO: Deploy contracts in order:
  // 1. ReferralRegistry
  // 2. Reputation
  // 3. Escrow
  // 4. SplitPayout

  // Example:
  // const Escrow = await ethers.getContractFactory('Escrow');
  // const escrow = await Escrow.deploy();
  // console.log('Escrow deployed to:', await escrow.getAddress());

  console.log('Deployment complete.');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
