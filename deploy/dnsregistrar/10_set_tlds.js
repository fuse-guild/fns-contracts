const { ethers } = require("hardhat");

const tld_map = {
    'mainnet': ['xyz'],
    'kovan': ['xyz'],
    'spark': ['xyz'],
    'ropsten': ['xyz'],
    'localhost': ['xyz'],
}

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

async function setTLDsOnRoot(owner, root, registrar, tlds) {
    console.log("owner:", owner);
    console.log("root:", root.address);
    console.log("registrar:", registrar.address);
    console.log("TLDs:", tlds);
    if(tlds === undefined){
        return [];
    }

    const transactions = []
    for(const tld of tlds) {
        console.log("TLD:", tld);
        const labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));
        console.log("labelhash:", labelhash);
        transactions.push(await root.setSubnodeOwner(labelhash, registrar.address, {from: owner}));
        console.log("transactions.length:", transactions.length);
    }
    return transactions;
}

async function setTLDsOnRegistry(owner, registry, registrar, tlds) {
    if(tlds === undefined){
        return [];
    }

    const transactions = []
    for(const tld of tlds) {
        const labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));
        transactions.push(await registry.setSubnodeOwner(ZERO_HASH, labelhash, registrar.address, {from: owner}));
    }
    return transactions;
}

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    console.log("network name:", network.name);
    console.log("deployer:", deployer);

    const registrar = await ethers.getContract('DNSRegistrar');
    console.log("registrar.address:", registrar.address);

    // let transactions;
    if(network.tags.use_root) {
        const root = await ethers.getContract('Root');
        console.log("root.address:", root.address);
        console.log("Setting TLDs on Root for", tld_map[network.name], "...");
        // transactions = await setTLDsOnRoot(deployer, root, registrar, tld_map[network.name]);
        const labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld_map[network.name][0]));
        console.log("labelhash:", labelhash);
        let tx = await root.setSubnodeOwner(labelhash, registrar.address, {from: deployer})
        console.log("Waiting for tx hash:", tx.hash);
        tx.wait();
    } else {
        const registry = await ethers.getContract('ENSRegistry');
        transactions = await setTLDsOnRegistry(deployer, registry, registrar, tld_map[network.name]);
    }

    // if(transactions.length > 0) {
    //     console.log(`Waiting on ${transactions.length} transactions setting DNS TLDs`)
    //     await Promise.all(transactions.map((tx) => tx.wait()));
    // }
};
module.exports.tags = ['dnsregistrar'];
module.exports.dependencies = ['registry', 'root', 'dnssec-oracle'];
