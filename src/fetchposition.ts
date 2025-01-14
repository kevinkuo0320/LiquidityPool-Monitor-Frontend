import { fetchPositionsForOwner, setWhirlpoolsConfig } from '@orca-so/whirlpools';
import { createSolanaRpc, address, mainnet } from '@solana/web3.js';

async function main() {
    await setWhirlpoolsConfig('solanaDevnet');
    const mainnetRpc = createSolanaRpc(mainnet('https://api.mainnet-beta.solana.com'));
    const owner = address("HKhMuLcetQ163owVrpKT3fgUszV64Cqa3bgdYGJQj4qh");

    const positions = await fetchPositionsForOwner(mainnetRpc, owner);
    console.log(positions);
}

main().catch(console.error);