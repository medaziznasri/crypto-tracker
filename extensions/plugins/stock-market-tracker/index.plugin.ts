/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';

@Injectable()
export class CryptoMarketPlugin extends BaseBlockPlugin<any> {
  template: { name: string } = { name: 'Crypto Market Tracker Block' };

  constructor(
    pluginService: PluginService,
    private readonly logger: LoggerService,
  ) {
    super('crypto-market-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  // Helper to fetch cryptocurrency data using CoinGecko API
  async fetchCryptoData(symbol: string, currency: string): Promise<any> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=${currency}`;

    try {
      const response = await axios.get(url);
      this.logger.log(`API Response for ${symbol}:`, response.data);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching data for ${symbol}:`, error.message);
      throw new Error(
        `Unable to fetch data for ${symbol}. Please ensure the ID is correct.`,
      );
    }
  }

  async process(
    block: Block,
    _ctx: Context,
    _convId: string,
  ): Promise<StdOutgoingTextEnvelope> {
    const { crypto_symbol, currency } = this.getArguments(block);
    this.logger.log(
      `Received crypto symbol: ${crypto_symbol}, currency: ${currency}`,
    );

    // Validate inputs
    if (!crypto_symbol || !currency) {
      return this.createTextEnvelope(
        'Please provide both a valid cryptocurrency ID and currency.',
      );
    }

    try {
      // Fetch data dynamically for the requested coin
      const cryptoData = await this.fetchCryptoData(crypto_symbol, currency);

      // Check if the data for the requested symbol and currency exists
      if (cryptoData[crypto_symbol] && cryptoData[crypto_symbol][currency]) {
        const price = cryptoData[crypto_symbol][currency];
        return this.createTextEnvelope(
          `The latest price for ${crypto_symbol.toUpperCase()}/${currency.toUpperCase()} is $${price} as of now.`,
        );
      } else {
        return this.createTextEnvelope(
          `No data available for the cryptocurrency "${crypto_symbol}". Please ensure the ID is correct.`,
        );
      }
    } catch (error) {
      return this.createTextEnvelope(
        `Error fetching data for "${crypto_symbol}". Please try again later.`,
      );
    }
  }

  // Helper method to create a text envelope
  private createTextEnvelope(message: string): StdOutgoingTextEnvelope {
    return {
      format: OutgoingMessageFormat.text,
      message: {
        text: message,
      },
    };
  }
}
