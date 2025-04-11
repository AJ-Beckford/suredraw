import nano from 'nano';

const couchDB = nano(process.env.COUCHDB_URL);

export const databases = {
  readyGroups: couchDB.use('readygroups'),
  adminWallet: couchDB.use('adminwallet'),
  prospectivePools: couchDB.use('prospectivepools')
};

export const initCouchDB = async () => {
  try {
    await couchDB.db.create('readygroups');
    await couchDB.db.create('adminwallet');
    await couchDB.db.create('prospectivepools');
    console.log('CouchDB databases initialized');
  } catch (error) {
    if (error.error !== 'file_exists') throw error;
  }
};