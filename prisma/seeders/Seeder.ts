class Seeder {
  public readonly seeder: string;

  constructor(seeder: string) {
    this.seeder = seeder;
  }

  /**
   * Success message
   */
  public success(): void {
    console.log(`✅ ${this.seeder} seeder is successfully executed!`);
  }

  /**
   * Failed message
   * @param e Error
   */
  public failed(e: Error): void {
    console.log(`❗ Error while executing ${this.seeder} seeder: \n ${e}`);
  }
}

export default Seeder;
