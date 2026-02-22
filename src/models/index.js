// models/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { DataTypes } from '@sequelize/core';
import sequelize from '../config/database.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};
const basename = path.basename(__filename);

// Dynamically load all models
const files = fs.readdirSync(__dirname).filter(
  (file) =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
);

for (const file of files) {
  const modelModule = await import(`./${file}`);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

const hasUuidAttribute = (model) => {
  // Sequelize v6/v7 compatibility:
  // prefer public accessor, then fall back to modelDefinition shape.
  if (typeof model.getAttributes === 'function') {
    const attributes = model.getAttributes();
    return Object.prototype.hasOwnProperty.call(attributes, 'uuid');
  }

  const attributes = model.modelDefinition?.attributes;
  if (!attributes) return false;

  if (attributes instanceof Map) {
    return attributes.has('uuid');
  }

  return Object.prototype.hasOwnProperty.call(attributes, 'uuid');
};

// Auto-generate UUID values like Laravel when model has a `uuid` attribute.
const attachUuidHooks = (model) => {
  if (!hasUuidAttribute(model)) return;

  // Ensure UUID exists even when callers forget to send it in create payloads.
  model.addHook('beforeValidate', (instance) => {
    if (!instance.uuid) {
      instance.uuid = randomUUID();
    }
  });

  model.addHook('beforeBulkCreate', (instances) => {
    // Keep bulkCreate behavior consistent with single create.
    for (const instance of instances) {
      if (!instance.uuid) {
        instance.uuid = randomUUID();
      }
    }
  });
};

Object.values(db).forEach((model) => attachUuidHooks(model));

// Run associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize.constructor;

export default db;
