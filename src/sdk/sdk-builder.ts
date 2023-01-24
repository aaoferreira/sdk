import { AllSourcesConfig, SourcesBasedOnConfig } from '@services/quotes/sources-list';
import { BuildFetchParams, buildFetchService } from './builders/fetch-builder';
import { BuildProviderParams, buildProviderSource } from './builders/provider-source-builder';
import { buildGasService, BuildGasParams } from './builders/gas-builder';
import { buildMulticallService } from './builders/multicall-builder';
import { BuildTokenParams, buildTokenService, CalculateTokenFromSourceParams } from './builders/token-builder';
import { BuildQuoteParams, buildQuoteService } from './builders/quote-builder';
import { ISDK } from './types';

export function buildSDK<Params extends BuildParams<CustomConfig>, CustomConfig extends Partial<AllSourcesConfig> = {}>(
  params?: Params
): ISDK<SourcesBasedOnConfig<CustomConfig>, CalculateTokenFromSourceParams<Params['tokens']>> {
  const fetchService = buildFetchService(params?.fetch);
  const providerSource = buildProviderSource(params?.provider);
  const multicallService = buildMulticallService(providerSource);
  const gasService = buildGasService(params?.gas, fetchService, providerSource, multicallService);
  const tokenService = buildTokenService<Params['tokens']>(params?.tokens, fetchService, multicallService);
  const quoteService = buildQuoteService(params?.quotes, fetchService, gasService, tokenService);

  return {
    fetchService,
    multicallService,
    gasService,
    tokenService,
    quoteService,
  };
}

type BuildParams<CustomConfig extends Partial<AllSourcesConfig>> = {
  fetch?: BuildFetchParams;
  provider?: BuildProviderParams;
  gas?: BuildGasParams;
  tokens?: BuildTokenParams;
  quotes?: BuildQuoteParams<CustomConfig>;
};
