import { z } from "zod";

const mongoConfigSchema = z
  .object({
    host: z.string().default("localhost"),
    port: z.coerce.number().int().positive().optional().default(27017),
    user: z.string().optional(),
    pass: z.string().optional(),
    dbName: z.string().default("requestBodies"),
  })
  .passthrough();

const getMongoConfig = () => {
  return mongoConfigSchema.parse({
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbName: process.env.MONGO_DBNAME,
    tls: process.env.MONGO_TLS,
    tlsCAFile: process.env.MONGO_CA_PATH,
    replicaSet: process.env.MONGO_REPLICA_SET,
    readPreference: process.env.MONGO_READ_PREF,
    retryWrites: process.env.MONGO_RETRY_WRITES,
    authSource: process.env.MONGO_AUTH_SRC,
  });
};

const pgConfigSchema = z
  .object({
    host: z.string().optional(),
    port: z.coerce.number().int().positive().optional(),
    user: z.string().optional(),
    pass: z.string().optional(),
    database: z.string().default("requestbin"),
  })
  .passthrough();

const getPGConfig = () => {
  return pgConfigSchema.parse({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    pass: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });
};

export default { getMongoConfig, getPGConfig };
