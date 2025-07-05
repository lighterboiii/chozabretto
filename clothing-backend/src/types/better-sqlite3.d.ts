declare module 'better-sqlite3' {
  import { EventEmitter } from 'events';

  interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    bind(...params: any[]): void;
  }

  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  class Database {
    constructor(filename: string);
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  export = Database;
}
