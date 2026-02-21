// types.ts
// Define the interface for an Endpoint object
export interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  body?: object;
  headers?: { [key: string]: string };
  status: 'Up' | 'Down' | 'Checking'; // 'Checking' status for initial/loading state
  lastChecked: string;
}
