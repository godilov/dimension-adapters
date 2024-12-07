import { Chain } from "@defillama/sdk/build/general";
import { ProtocolType, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from '../../helpers/chains';
import fetchURL from "../../utils/fetchURL"

const MANTIS_INDEXER_API = `localhost:9500`;
const MANTIS_VOLUME_API = `${MANTIS_INDEXER_API}/volume`;

const fetch = (chain: Chain) => async (timestamp: number) => {
    const url = `${MANTIS_VOLUME_API}?timestamp=${timestamp}&chain=${chain}`;

    const volume = await fetchURL(url);

    const totalVolume = volume.total;
    const dailyVolume = volume.daily;

    return {
        totalVolume,
        dailyVolume,
        timestamp
    }
}

const adapter: SimpleAdapter = {
    adapter: {
        [CHAIN.SOLANA]: {
            fetch: fetch(CHAIN.SOLANA),
            runAtCurrTime: true,
            start: 1730746800,
            meta: {
                methodology: "Sum of all executed intents with Solana as input or output",
            },
        },
        [CHAIN.ETHEREUM]: {
            fetch: fetch(CHAIN.ETHEREUM),
            runAtCurrTime: true,
            start: 1730746800,
            meta: {
                methodology: "Sum of all executed intents with Ethereum as input or output",
            },
        }
    },
    protocolType: ProtocolType.PROTOCOL,
    isExpensiveAdapter: true,
    timetravel: false,
}

export default adapter;
