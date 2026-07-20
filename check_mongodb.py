#!/usr/bin/env python3
"""
Check MongoDB data storage and show where data is physically stored.
"""

import os
import sys
from pymongo import MongoClient
from datetime import datetime
import json

def check_mongodb_storage():
    print("=" * 60)
    print("🗄️  MONGODB STORAGE INFORMATION")
    print("=" * 60)
    
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client.agri_analytics
        
        print("✅ MongoDB Connection: SUCCESS")
        print(f"📍 Connection String: mongodb://localhost:27017/agri_analytics")
        print(f"🏠 Database Name: agri_analytics")
        print()
        
        # List all collections
        collections = db.list_collection_names()
        print(f"📂 Collections Found: {len(collections)}")
        for col in collections:
            count = db[col].count_documents({})
            print(f"   • {col}: {count} documents")
        print()
        
        # Database statistics
        stats = db.command("dbstats")
        print("📊 Database Statistics:")
        print(f"   • Data Size: {stats.get('dataSize', 0):,} bytes ({stats.get('dataSize', 0) / (1024*1024):.2f} MB)")
        print(f"   • Storage Size: {stats.get('storageSize', 0):,} bytes ({stats.get('storageSize', 0) / (1024*1024):.2f} MB)")
        print(f"   • Index Size: {stats.get('indexSize', 0):,} bytes ({stats.get('indexSize', 0) / (1024*1024):.2f} MB)")
        print(f"   • Collections: {stats.get('collections', 0)}")
        print(f"   • Objects: {stats.get('objects', 0):,}")
        print()
        
        # Show server info to find data directory
        server_info = client.server_info()
        admin_db = client.admin
        
        print("🖥️  Server Information:")
        print(f"   • MongoDB Version: {server_info.get('version', 'Unknown')}")
        print(f"   • Server Process ID: {server_info.get('pid', 'Unknown')}")
        print()
        
        # Try to get storage engine info
        try:
            status = admin_db.command("serverStatus")
            storage_engine = status.get('storageEngine', {}).get('name', 'Unknown')
            print(f"📦 Storage Engine: {storage_engine}")
            
            # For WiredTiger, try to get more info
            if storage_engine == 'wiredTiger':
                wt_info = status.get('wiredTiger', {})
                print(f"   • Cache Size: {wt_info.get('cache', {}).get('maximum bytes configured', 'Unknown')}")
        except Exception as e:
            print(f"⚠️  Could not get storage engine info: {e}")
        
        print()
        print("📁 Data Storage Locations (Common paths):")
        
        # Common MongoDB data directories on Windows
        common_paths = [
            "C:\\data\\db",
            "C:\\Program Files\\MongoDB\\Server\\7.0\\data",
            "C:\\Program Files\\MongoDB\\Server\\6.0\\data", 
            "C:\\Program Files\\MongoDB\\Server\\5.0\\data",
            "C:\\Users\\%USERNAME%\\AppData\\Local\\MongoDB",
            "%PROGRAMDATA%\\MongoDB"
        ]
        
        for path in common_paths:
            expanded_path = os.path.expandvars(path)
            if os.path.exists(expanded_path):
                print(f"   ✅ {expanded_path} (EXISTS)")
                # Check for agri_analytics files
                try:
                    files = os.listdir(expanded_path)
                    agri_files = [f for f in files if 'agri_analytics' in f.lower()]
                    if agri_files:
                        print(f"      └── agri_analytics files found: {len(agri_files)}")
                        for f in agri_files[:3]:  # Show first 3
                            print(f"          • {f}")
                        if len(agri_files) > 3:
                            print(f"          • ... and {len(agri_files) - 3} more")
                except PermissionError:
                    print(f"      └── (Permission denied to list files)")
            else:
                print(f"   ❌ {expanded_path} (not found)")
        
        print()
        
        # Show recent data samples
        if collections:
            print("📄 Recent Data Samples:")
            
            # Show analyses if exists
            if 'analyses' in collections:
                recent_analysis = db.analyses.find_one({}, sort=[('timestamp', -1)])
                if recent_analysis:
                    print("   🔬 Latest Analysis:")
                    print(f"      • ID: {recent_analysis.get('analysis_id', 'N/A')}")
                    print(f"      • Timestamp: {recent_analysis.get('timestamp', 'N/A')}")
                    print(f"      • Crop: {recent_analysis.get('input_conditions', {}).get('crop', 'N/A')}")
                    print(f"      • Yield: {recent_analysis.get('predictions', {}).get('yield', {}).get('predicted_yield', 'N/A')} kg/ha")
            
            # Show pest detections if exists
            if 'pest_detections' in collections:
                recent_pest = db.pest_detections.find_one({}, sort=[('timestamp', -1)])
                if recent_pest:
                    print("   🐛 Latest Pest Detection:")
                    print(f"      • ID: {recent_pest.get('detection_id', 'N/A')}")
                    print(f"      • Pest: {recent_pest.get('predicted_pest', 'N/A')}")
                    print(f"      • Risk: {recent_pest.get('risk_level', 'N/A')}")
            
            # Show market predictions if exists
            if 'market_predictions' in collections:
                recent_market = db.market_predictions.find_one({}, sort=[('timestamp', -1)])
                if recent_market:
                    print("   💰 Latest Market Prediction:")
                    print(f"      • ID: {recent_market.get('prediction_id', 'N/A')}")
                    print(f"      • Price: {recent_market.get('currency', 'USD')} {recent_market.get('predicted_price', 'N/A')}")
                    print(f"      • Outlook: {recent_market.get('market_analysis', {}).get('outlook', 'N/A')}")
        
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")
        print("💡 Make sure MongoDB is running on localhost:27017")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    check_mongodb_storage()