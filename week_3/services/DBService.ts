import { DB } from '../loaders/postgresql';

class DBService{
    private readonly client: any;

    constructor(DB: any) {
        this.client = new DB();
    }

    connect() {
        this.client.connect();
    }
}

export const DBServiceInstance = new DBService(DB);