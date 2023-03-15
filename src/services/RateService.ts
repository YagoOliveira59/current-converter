import config from "../config";
import pinoConfig from "../utils/logger";

const logger = pinoConfig;

export interface Rate {
  base: string;
  date: string;
  rates: {
    [propertyName: string]: number;
  };
  success: boolean;
  timestamp: number;
}

export class RateService {
  async fetchRateApi(from: string, to: string) {
    return new Promise<Rate>((resolve, reject) => {
      const requestHeader = new Headers();
      requestHeader.append("apikey", config.token);

      const requestOptions = {
        method: "GET",
        headers: requestHeader,
      };

      fetch(
        `https://api.apilayer.com/exchangerates_data/latest?symbols=${to}&base=${from}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
            logger.error(data.error);
          }
          resolve(data);
        })
        .catch((error) => {
          logger.error(error);
          reject(error);
        });
    });
  }
}
