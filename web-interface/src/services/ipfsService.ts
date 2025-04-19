
import { create } from 'ipfs-http-client';

// Configure IPFS client with a public gateway
// For a production app, you'd want to use your own IPFS node or a service like Infura
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export const ipfsService = {
  /**
   * Upload data to IPFS
   * @param data Data to store on IPFS
   * @returns CID (Content Identifier) of the stored data
   */
  async uploadData(data: any): Promise<string> {
    try {
      // Convert data to JSON string
      const jsonData = JSON.stringify(data);
      
      // Use TextEncoder instead of Buffer for browser compatibility
      const encoder = new TextEncoder();
      const buffer = encoder.encode(jsonData);
      
      // Add data to IPFS
      const result = await ipfs.add(buffer);
      return result.cid.toString();
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload data to IPFS');
    }
  },

  /**
   * Retrieve data from IPFS
   * @param cid CID (Content Identifier) of the data to retrieve
   * @returns The data stored at the given CID
   */
  async retrieveData(cid: string): Promise<any> {
    try {
      const chunks = [];
      
      // Retrieve data from IPFS
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      
      // Concatenate chunks and parse the result
      const decoder = new TextDecoder();
      const data = decoder.decode(new Uint8Array(chunks.flatMap(chunk => 
        Array.from(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk))
      )));
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw new Error('Failed to retrieve data from IPFS');
    }
  }
};

export default ipfsService;
