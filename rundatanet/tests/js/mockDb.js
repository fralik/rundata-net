import Database from 'better-sqlite3';

export const mockDb = {
    exec: (query) => {
        const dbPath = 'rundatanet/static/runes/runes.sqlite3';
        const db = new Database(dbPath, { readonly: true });
        const stmt = db.prepare(query);
        const content = stmt.all();
        if (content.length === 0) {
            console.log('No content found for query:', query);
            return [];
        }

        return [{
            columns: Object.keys(content[0]),
            values: content.map(row => Object.values(row))
        }];
    }
  };