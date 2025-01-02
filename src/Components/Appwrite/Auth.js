import {Client, Account, Databases} from 'appwrite'

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

const client = new Client();

export  const databases = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId); 

export const account = new Account(client);
export { ID  } from 'appwrite';
