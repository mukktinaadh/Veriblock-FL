const Migrations = artifacts.require("Migrations");
const FederatedModel = artifacts.require("FederatedModel");
const Verifier = artifacts.require("Verifier");
const VerifierAggregator = artifacts.require("VerifierAggregator");

const fs = require('fs');
const yaml = require('js-yaml');

module.exports = async function (deployer, network, accounts) {
  // Read YAML Config File
  const configPath = '../../CONFIG.yaml';
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const data = yaml.load(fileContents).DEFAULT;

  // Deploy Migrations contract
  await deployer.deploy(Migrations);

  // Deploy Verifier contract if not deployed already
  let verifierInstance;
  try {
    verifierInstance = await Verifier.deployed();
  } catch (error) {
    await deployer.deploy(Verifier, { gas: data.Gas });
    verifierInstance = await Verifier.deployed();
  }

  // Deploy VerifierAggregator contract if not deployed already
  let verifierAggregatorInstance;
  try {
    verifierAggregatorInstance = await VerifierAggregator.deployed();
  } catch (error) {
    await deployer.deploy(VerifierAggregator, { gas: data.Gas });
    verifierAggregatorInstance = await VerifierAggregator.deployed();
  }

  // Deploy FederatedModel contract if not deployed already
  let federatedModelInstance;
  try {
    federatedModelInstance = await FederatedModel.deployed();
  } catch (error) {
    await deployer.deploy(
      FederatedModel,
      data.InputDimension,
      data.OutputDimension,
      data.LearningRate,
      data.Precision,
      data.BatchSize,
      data.IntervalTime,
      { gas: data.Gas }
    );
    federatedModelInstance = await FederatedModel.deployed();
  }

  console.log('Contracts deployed successfully:');
  console.log('Migrations Address:', Migrations.address);
  console.log('Verifier Address:', verifierInstance.address);
  console.log('VerifierAggregator Address:', verifierAggregatorInstance.address);
  console.log('FederatedModel Address:', federatedModelInstance.address);
};