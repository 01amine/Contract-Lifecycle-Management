/**
 * Demo Versioning System
 * 
 * This module provides a client-side versioning simulation for demonstration purposes.
 * It generates consistent version histories for contracts to showcase the blockchain-based
 * versioning capabilities of the Contract Lifecycle Management system.
 */

export interface ContractVersion {
  version: number;
  hash: string;
  blockNumber: number;
  timestamp: Date;
  author: string;
  changes: string;
  transactionId: string;
  previousHash: string;
}

// Seeded random number generator for consistency
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const x = Math.sin(hash++) * 10000;
  return x - Math.floor(x);
}

// Generate a blockchain-style hash
function generateHash(seed: string, version: number): string {
  const chars = '0123456789abcdef';
  let hash = '';
  const combined = seed + version;
  
  for (let i = 0; i < 64; i++) {
    const rand = seededRandom(combined + i);
    hash += chars[Math.floor(rand * 16)];
  }
  
  return `0x${hash}`;
}

// Generate transaction ID
function generateTransactionId(seed: string, version: number): string {
  const chars = '0123456789ABCDEF';
  let txId = '';
  const combined = seed + version + 'tx';
  
  for (let i = 0; i < 32; i++) {
    const rand = seededRandom(combined + i);
    txId += chars[Math.floor(rand * 16)];
  }
  
  return txId;
}

// Sample authors for demo
const AUTHORS = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Williams',
  'David Brown',
  'Emma Davis',
  'Legal Team',
  'Compliance Officer',
  'Contract Manager'
];

// Sample change descriptions
const CHANGE_TYPES = [
  'Initial contract draft created',
  'Updated payment terms and schedules',
  'Added confidentiality clause',
  'Modified termination conditions',
  'Revised liability limitations',
  'Updated compliance requirements',
  'Added arbitration clause',
  'Modified intellectual property terms',
  'Updated jurisdiction clauses',
  'Refined delivery obligations',
  'Added force majeure clause',
  'Updated indemnification terms',
  'Modified warranty provisions',
  'Adjusted service level agreements',
  'Updated data protection clauses'
];

/**
 * Get the current version number for a contract (demo version)
 */
export function getContractVersion(contractId: string, createdAt: string): number {
  const seed = contractId + createdAt;
  const rand = seededRandom(seed);
  
  // Most contracts have 1-3 versions, some have more
  if (rand < 0.5) return 1;
  if (rand < 0.75) return 2;
  if (rand < 0.9) return 3;
  if (rand < 0.96) return 4;
  return Math.floor(rand * 8) + 1; // 1-8 versions
}

/**
 * Generate a complete version history for a contract
 */
export function generateVersionHistory(
  contractId: string,
  createdAt: string,
  currentVersion?: number
): ContractVersion[] {
  const versions: ContractVersion[] = [];
  const versionCount = currentVersion || getContractVersion(contractId, createdAt);
  const baseTime = new Date(createdAt);
  
  let previousHash = '0x' + '0'.repeat(64); // Genesis hash
  
  for (let v = 1; v <= versionCount; v++) {
    const seed = contractId + v;
    const rand = seededRandom(seed);
    
    // Calculate timestamp (spread versions over time since creation)
    const daysOffset = Math.floor((v - 1) * (30 + rand * 60)); // 30-90 days between versions
    const timestamp = new Date(baseTime.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    
    // Generate hash
    const hash = generateHash(contractId, v);
    
    // Block number (incremental with some randomness)
    const baseBlock = 1000000 + Math.floor(seededRandom(contractId) * 100000);
    const blockNumber = baseBlock + v * 100 + Math.floor(rand * 50);
    
    // Select author
    const authorIndex = Math.floor(seededRandom(seed + 'author') * AUTHORS.length);
    const author = AUTHORS[authorIndex];
    
    // Select change description
    let changes: string;
    if (v === 1) {
      changes = CHANGE_TYPES[0]; // Always "Initial contract draft created" for v1
    } else {
      const changeIndex = 1 + Math.floor(seededRandom(seed + 'change') * (CHANGE_TYPES.length - 1));
      changes = CHANGE_TYPES[changeIndex];
    }
    
    // Generate transaction ID
    const transactionId = generateTransactionId(contractId, v);
    
    versions.push({
      version: v,
      hash,
      blockNumber,
      timestamp,
      author,
      changes,
      transactionId,
      previousHash
    });
    
    previousHash = hash; // Chain the hashes
  }
  
  return versions.reverse(); // Most recent first
}

/**
 * Get blockchain verification URL (demo purposes)
 */
export function getBlockchainExplorerUrl(transactionId: string): string {
  return `https://explorer.hyperledger.org/tx/${transactionId}`;
}

/**
 * Verify if two hashes are properly chained
 */
export function verifyHashChain(current: ContractVersion, previous?: ContractVersion): boolean {
  if (!previous) {
    return current.previousHash === '0x' + '0'.repeat(64);
  }
  return current.previousHash === previous.hash;
}
