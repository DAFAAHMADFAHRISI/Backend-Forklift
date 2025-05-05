const Queue = require("bull");

// Flag untuk mengaktifkan/menonaktifkan queue
const enableQueue = false;

const redisConfig = {
  redis: { 
    host: "172.19.58.12", 
    port: 6379,
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
    retryStrategy: function(times) {
      // Hanya retry 1 kali dengan delay 1 detik
      if (times > 1) return null; // Tidak retry lagi setelah kali kedua
      return 1000;
    }
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: 'fixed',
      delay: 1000,
    },
  },
};

// Fungsi untuk membuat queue dengan fallback
const createQueue = (name, config) => {
  if (!enableQueue) {
    // Return mock queue object jika queue dinonaktifkan
    return {
      add: async (data) => ({ data }),
      on: () => {},
      getWaitingCount: async () => 0,
      getActiveCount: async () => 0,
      getFailedCount: async () => 0
    };
  }
  
  try {
    return new Queue(name, config);
  } catch (error) {
    console.error(`Error creating ${name} queue:`, error);
    // Return mock queue jika gagal membuat queue asli
    return {
      add: async (data) => ({ data }),
      on: () => {},
      getWaitingCount: async () => 0,
      getActiveCount: async () => 0,
      getFailedCount: async () => 0
    };
  }
};

// Create empty module exports
module.exports = {};
