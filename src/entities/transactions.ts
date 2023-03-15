export interface TransactionProps {
  userId: number;
  currencyOrigin: string;
  amountOrigin: number;
  currencyDestiny: string;
}

export class Transaction {
  private props: TransactionProps;

  get userId(): number {
    return this.props.userId;
  }
  get currencyOrigin(): string {
    return this.props.currencyOrigin;
  }
  get amountOrigin(): number {
    return this.props.amountOrigin;
  }
  get currencyDestiny(): string {
    return this.props.currencyDestiny;
  }
  constructor(props: TransactionProps) {
    this.props = props;
  }
}
