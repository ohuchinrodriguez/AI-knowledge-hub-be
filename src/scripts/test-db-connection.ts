#!/usr/bin/env ts-node

/**
 * Script to test database connection
 * Usage: npm run test-db-connection
 */

import 'reflect-metadata';
import { createDataSource } from '../config/database';

async function testDatabaseConnection() {
  console.log('🔌 Testing database connection...');
  console.log('Configuration:');
  console.log(`  Host: ${process.env['DB_HOST'] || 'localhost'}`);
  console.log(`  Port: ${process.env['DB_PORT'] || '5432'}`);
  console.log(`  Database: ${process.env['DB_DATABASE'] || 'ai_knowledge_hub'}`);
  console.log(`  Username: ${process.env['DB_USERNAME'] || 'postgres'}`);
  console.log(`  SSL: ${process.env['NODE_ENV'] === 'production' ? 'enabled' : 'disabled'}`);
  console.log('');

  const dataSource = createDataSource();

  try {
    console.log('⏳ Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    console.log('⏳ Testing query execution...');
    const result = await dataSource.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query execution successful!');
    console.log(`   Current time: ${result[0].current_time}`);
    console.log(`   PostgreSQL version: ${result[0].pg_version}`);
    
    // Check if tables exist
    console.log('⏳ Checking database schema...');
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tables.length > 0) {
      console.log('✅ Found existing tables:');
      tables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log('ℹ️  No tables found. Database schema will be created on first run.');
    }

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Load environment variables
require('dotenv').config();

testDatabaseConnection()
  .then(() => {
    console.log('🎉 Database test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database test failed:', error);
    process.exit(1);
  });
